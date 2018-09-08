# -*- coding: utf-8 -*-
import os
import sys
import web
import time
import json
import urllib
from in2mysql import MySQL_API
from web.wsgiserver import CherryPyWSGIServer

mysql = MySQL_API()
urls = ("/.*", "Index")

class MyApplication(web.application):
	def run(self, port=8000, *middleware):
		func = self.wsgifunc(*middleware)
		return web.httpserver.runsimple(func, ('0.0.0.0', port))

class Index(object):
	def GET(self, *args):
		try:
			input_data = web.input()
			input_data = dict(input_data)

			market_name = input_data.get("market_name", "")

			msg = input_data.get("data", "")
			msg = urllib.unquote(msg)
			msg = json.loads(msg)
			# print msg

			method = msg["method"]

			if method != "depth.update":
				return ""

			params = msg["params"]
			asks = params[1].get("asks", [])
			bids = params[1].get("bids", [])

			N = 0
			asks_amount = 0
			bids_amount = 0

			for item in asks:
				price, vol = item
				price = float(price)
				vol = float(vol)
				money = price * vol
				asks_amount += money
				if money >= 10000.0 / 7.0 * 5:
					m = u"---卖单: {} {} ({})\n".format(market_name, vol, price)
					sys.stdout.write(m)

			for item in bids:
				price, vol = item
				price = float(price)
				vol = float(vol)
				money = price * vol
				bids_amount += money
				if money >= 10000.0 / 7.0 * 5:
					m = u"+++买单: {} {} ({})\n".format(market_name, vol, price)
					sys.stdout.write(m)

			N = bids_amount - asks_amount
			if len(asks) > 10:
				sql = "insert into asks_bids (market_name, asks, bids, asks_amount, bids_amount, N) values (%s, %s, %s, %s, %s, %s)"
				mysql.write_items(sql=sql, param=[(market_name, json.dumps(asks), json.dumps(bids), asks_amount, bids_amount, N)], print_error=True, auto_commit=True)
		except:
			pass

		return "ok"
			
if __name__ == "__main__":
	# test()

	if len(sys.argv) == 2:
		port = int(sys.argv[1])
	else:
		port = 8001

	app = MyApplication(urls, globals())
	app.run(port=port)


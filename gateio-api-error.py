#encoding=utf8
import sys
import ssl
import time
import json
import math
import random
import thread
import websocket

def get_rand_int(n):
	r = ""
	for i in range(n):
		r += str(random.randrange(0, 9))
	return r

def on_message(ws, message):
	print "=" * 80
	print "on_message"
	print(message)

def on_error(ws, error):
	print "=" * 80
	print "on_error"
	print(error)

def on_close(ws):
	print "=" * 80
	print "on_close"
	pass


client_id = get_rand_int(7)
market_name = "ETH_USDT"

def on_open(ws):
	print "=" * 80
	print "on_open"
	def run(*args):
		while True:
			print ws
			d = {
				"id": client_id,
				"method": "depth.subscribe",
				"params": [market_name, 30, "0.01"]
			}
			req = json.dumps(d)
			# print req
			req = '{"id":"2342343","method":"server.ping","params":[]}'
			print req
			ws.send(req)

			req = '{"id":"2342343","method":"depth.subscribe","params":["ETH_USDT",30,"0.01"]}'
			print req
			ws.send(req)

			time.sleep(3)

	thread.start_new_thread(run, ())
	# run()

if __name__ == "__main__":

	# websocket.enableTrace(True)

	wss_url = "wss://webws.gateio.io/v3/?v=" + get_rand_int(6)
	cookie = "Hm_lvt_0a1ead8031fdf1a7228954da1b158d36=1536244247; sc_is_visitor_unique=rx11802877.1536245515.3FE58F001DCF4F1457A993663C25850F.1.1.1.1.1.1.1.1.1"

	headers = None
	headers = [
		# "GET %s HTTP/1.1" % wss_url,
		"Accept-Encoding: gzip, deflate, br",
		"Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7",
		"Cache-Control: no-cache",
		# "Connection: Upgrade",
		"Host: webws.gateio.io",
		"Origin: https://gateio.io",
		"Pragma: no-cache",
		"Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits",
		# "Sec-WebSocket-Key: ObRfPQfR5l9pyeUDGTyUow==",
		# "Sec-WebSocket-Version: 13",
		"Upgrade: websocket",
		"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
	]

	import  itertools
	# for i in range(len(headers)):
	all_headers = itertools.combinations(headers, 5)
	for header in all_headers:
		try:
			print "=" * 80
			print header
			ws = websocket.create_connection(wss_url, timeout=1.0, header=header)
			req = '{"id":"2342343","method":"depth.subscribe","params":["ETH_USDT",30,"0.01"]}'
			ws.send(req)
			print ws.recv()
			print "++++++++++++++++++++++++++++++++++++++"
			break
		except:
			pass

		# ws = websocket.WebSocketApp(
		# 	url=wss_url,
		# 	on_message=on_message,
		# 	on_error=on_error,
		# 	on_close=on_close,
		# 	header=header,
		# 	# cookie=cookie
		# )
		# ws.on_open = on_open
		# ws.run_forever(
		# 	origin="https://gate.io",
		# 	sslopt={
		# 		"cert_reqs": ssl.CERT_NONE,
		# 		"check_hostname": False
		# 	}
		# )
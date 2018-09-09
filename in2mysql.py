import os
import sys
import json
import time
import MySQLdb
from warnings import filterwarnings
filterwarnings('ignore', category=MySQLdb.Warning)
import MySQLdb.cursors as cursors

class MySQL_API(object):

	def __init__(self, conf_file="DataBase.conf", connect_info={}, cursorclass_name=None):
		"""
		init and connect to mysql
		"""
		self.bCrateDb = False	
		conf_file_list = []
		conf_file_list.append(conf_file)
		conf_file_list.append("DataBase.conf")
		conf_file_list.append("./conf/DataBase.conf")
		conf_file_list.append("../conf/DataBase.conf")
		conf_file_list = list(set(conf_file_list))
		
		for conf_file in conf_file_list:
			if not connect_info and os.path.exists(conf_file):
				fileHandler = open(conf_file, "r")
				data = fileHandler.read()
				fileHandler.close()
				connect_info = json.loads(data)
		if not connect_info:
			print "connect info error!"
			sys.exit(1)
			
		host = connect_info.get("host", "127.0.0.1")
		port = connect_info.get("port", 3306)
		user = connect_info.get("user", "root")
		passwd = connect_info.get("passwd", "root")
		db = connect_info.get("db", "mysql")
		cursorclass_name = cursorclass_name if cursorclass_name else connect_info.get("cursorclass", "Cursor")
		cursorclass = getattr(cursors, cursorclass_name)
		
		try:
			self.conn = MySQLdb.connect(host=host, port=port, user=user, passwd=passwd, db=db, cursorclass=cursorclass)
		except Exception, e:
			if "Unknown database" in str(e):
				try:
					self.conn = MySQLdb.connect(host=host, port=port, user=user, passwd=passwd, cursorclass=cursorclass)
					self.bCrateDb = True
				except Exception as e2:
					print e2
					self.conn = None
		if not self.conn:
			print "Failed To Connect To MySQL,Quit..."
			sys.exit(1)

		# print "Connect To MySQL Done..."
		self.cursor = self.conn.cursor() 	
		# self.cursor.execute("set names utf8")
		self.cursor.execute("set names utf8mb4")

		if self.bCrateDb and db:
			print "create db:%s" %db
			self.cursor.execute("CREATE DATABASE `%s` /*!40100 COLLATE 'utf8_general_ci' */;" %db) 
			self.conn.select_db(db)
	
	def write_items(self, sql, param=None, auto_commit=True, print_error=False, retry=3):
		ret = [True, ""]
		try:
			if not param:
				self.cursor.execute(sql)
			else:
				if type(param) == type((1, )) or type(param) == type([1]):
					# param = (("bbb",int(time.time())), ("ccc",33), ("ddd",44) )  
					self.cursor.executemany(sql, param)
			ret[1] = "Ok"

			if auto_commit:
				self.conn.commit()

		except Exception as e:
			if retry >= 0:
				time.sleep(0.2)
				return self.write_items(sql=sql, param=param, auto_commit=auto_commit, print_error=print_error, retry=retry-1)

			if print_error:
				print "=" * 60
				print sql
				print e
				# print param
			ret[0] = False
			ret[1] = str(e)

		return ret
		
	def query(self, sql, param=None, print_error=False):
		ret = None
		try:
			n = self.cursor.execute(sql, param)
			ret = self.cursor.fetchall()
		except Exception as e:
			if print_error:
				print e
				print sql
				ret = sql		
		return ret
	
	def create_database(self, db_name):
		sql = "CREATE DATABASE IF NOT EXISTS %s COLLATE='utf8_general_ci' " %db_name
		self.query(sql)
		self.commit()
		self.conn.select_db(db_name)
		
	def commit(self):
		self.conn.commit()
		
	def close(self):
		if self.cursor:
			self.cursor.close()
		if self.conn:
			self.conn.close()
		
	def __del__(self):
		if self.cursor:
			self.cursor.close()
		if self.conn:
			self.conn.close()
		
if __name__ == "__main__":
	
	print "TODO"
	# api = Write2MySQL()

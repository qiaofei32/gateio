#encoding=utf8
import sys
import pandas
import matplotlib
import matplotlib.dates as mdates
from matplotlib import pyplot as plt
from matplotlib.widgets import Cursor
from in2mysql import MySQL_API

market_list = ["EOS", "ETH", "BTC"]

if len(sys.argv) >= 2:
	market_name = sys.argv[1]
else:
	try:
		market_index = int(raw_input("1.EOS\n2.ETH\n3.BTC\n"))-1
	except:
		market_index = 0

	market_index = market_index % len(market_list)
	market_name = market_list[market_index]

if not market_name.endswith("_USDT"):
	market_name = market_name.upper() + "_USDT"

mysql = MySQL_API()
result = mysql.query(sql='select ts, asks_amount, bids_amount, N from asks_bids a where a.market_name = "{}" order by a.id asc'.format(market_name))

x = []
y = []

for row in result:
	ts, asks_amount, bids_amount, N = row
	x.append(ts)
	y.append(N)


# matplotlib.rc('font', family='SimHei')			# 解决中文标题乱码
# plt.rcParams['font.sans-serif']=['SimHei']	# 解决中文标题乱码


df = pandas.DataFrame(data=zip(x, y), columns=["time", "amount"])

xfmt = mdates.DateFormatter('%Y-%m-%d %H:%M:%S')					# 解决X轴时间显示问题
df.time = pandas.to_datetime(df.time, format='%Y-%m-%d %H:%M:%S')	# 解决X轴时间显示问题

df.plot(x='time', y='amount', kind="line", title=market_name, linewidth=2, figsize=(12, 6))
ax = plt.gca()
cursor = Cursor(ax, useblit=True, color='red', linewidth=2)

mng = plt.get_current_fig_manager()
# mng.frame.Maximize(True)		### for 'wxAgg' as backend
# mng.window.showMaximized()	### for 'Qt4Agg' as backend
mng.window.state('zoomed')		### for 'TkAgg' as backend

plt.show()

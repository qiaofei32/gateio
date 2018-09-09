var g_ask_list = null, g_bid_list = null, g_trade_list = null, g_fiat = "", g_last_fiat = "", g_latest_price = get_element("orderbook_last_rate").innerHTML, g_left_side_price = [], g_cur_depth_precision = genDecimals(global_precision_rate);
function innerOd(e, t) {
	var a = 5;
	if (1 == ordersCo && (a = 10), t && (a = 31), g_ask_list && (0 == e || 1 == e)) {
		var i = build_order_table(g_ask_list, 1, a);
		"" != i && (get_element("ul-ask-list").innerHTML = i)
	}
	if (g_bid_list && (0 == e || 2 == e)) {
		var r = build_order_table(g_bid_list, 0, a);
		"" != r && (get_element("ul-bid-list").innerHTML = r)
	}
}
function get_global_fiat_rate(e, t) {
	return e = e.toUpperCase(),
	fiat_rate = 1,
	"BTC" == e ? "CNY" == t ? fiat_rate = global_btc_cny_rate : "KRW" == t ? fiat_rate = global_btc_krw_rate : "USD" == t && (fiat_rate = global_btc_usd_rate) : "ETH" == e ? "CNY" == t ? fiat_rate = global_eth_cny_rate : "KRW" == t ? fiat_rate = global_eth_krw_rate : "USD" == t && (fiat_rate = global_eth_usd_rate) : "USDT" == e ? "CNY" == t ? fiat_rate = global_usdt_cny_rate : "KRW" == t && (fiat_rate = global_usdt_krw_rate) : "QTUM" == e && ("CNY" == t ? fiat_rate = global_qtum_cny_rate : "KRW" == t ? fiat_rate = global_qtum_krw_rate : "USD" == t && (fiat_rate = global_qtum_usd_rate)),
	fiat_rate
}
function get_currency_unitSymbol(e) {
	return e = e.toUpperCase(),
	unitSymbol = "$",
	"BTC" == e ? unitSymbol = "฿" : "ETH" == e ? unitSymbol = "E" : "USDT" == e ? unitSymbol = "$" : "QTUM" == e && (unitSymbol = "Q"),
	unitSymbol
}
function rebuild_orderbook_trade_list(e) {
	g_last_fiat = g_fiat,
	g_fiat = e;
	var t = trade_global.symbol.split("_"),
	a = t[0].toUpperCase(),
	i = t[1].toUpperCase();
	if (change_fiat_tags(e, a, i), g_ask_list && g_ask_list[0]) {
		updateDepth(g_bid_list, g_ask_list);
		var r = build_order_table(g_ask_list, 1, 31);
		"" != r && (get_element("ul-ask-list").innerHTML = r)
	}
	if (g_bid_list && g_bid_list[0]) {
		updateDepth(g_bid_list, g_ask_list);
		var l = build_order_table(g_bid_list, 0, 31);
		"" != l && (get_element("ul-bid-list").innerHTML = l)
	}
	if (g_trade_list && g_trade_list[0]) {
		var s = build_trade_history_table(g_trade_list);
		"" != s && (get_element("ul-trade-list").innerHTML = s)
	}
	var _ = 1,
	o = $("#ask_rate"),
	n = $("#bid_rate"),
	d = $("#ul-ask-list").find("li"),
	c = $("#ul-bid-list").find("li"),
	g = o.val(),
	p = n.val(),
	b = .5 * (parseFloat(d.eq(0).find(".price").html()) + parseFloat(c.eq(0).find(".price").html()));
	parseFloat(g),
	parseFloat(p);
	0 == b && (b = 1e-7),
	g_last_fiat == g_fiat ? (o.val(d.eq(0).find(".price").html()), n.val(c.eq(0).find(".price").html())) : (_ = get_global_fiat_rate(i, "" == g_fiat ? g_last_fiat : g_fiat), "" == g_fiat ? (g /= _, p /= _) : (g *= _, p *= _), rate_decimals = 10 <= g ? 2 : 1 <= g ? 3 : .1 <= g ? 4 : .01 <= g ? 5 : .001 <= g ? 6 : 7, g = g.toFixed(rate_decimals), p = p.toFixed(rate_decimals), o.val(g), n.val(p)),
	_page.obj.on_input_bid_rate(),
	_page.obj.recalc_fee("bid"),
	_page.obj.on_input_ask_rate(),
	_page.obj.recalc_fee("ask")
}
function build_trade_history_table(e) {
	if (!e || !e[0])
		return "";
	var t = parseInt($("#ul-trade-list").height() / 24) + 1,
	a = 1;
	0 < e.length && (a = e[0][1]);
	var i,
	r = 3,
	l = a * (i = get_global_fiat_rate(trade_global.symbol.split("_")[1].toUpperCase(), g_fiat));
	r = 10 <= l ? 2 : 1 <= l ? 3 : .1 <= l ? 4 : .01 <= l ? 5 : .001 <= l ? 6 : 7;
	for (var s = "", _ = 0; _ < e.length; _++)
		if (_ <= t) {
			var o,
			n = e[_];
			if (n.length < 7)
				continue;
			o = "sell" == n[5] ? "down" : "up";
			var d = new Date(1e3 * n[4]),
			c = d.getHours(),
			g = "0" + d.getMinutes(),
			p = "0" + d.getSeconds(),
			b = c + ":" + g.substr(-2) + ":" + p.substr(-2),
			u = n[2],
			f = n[3],
			m = n[1];
			"" != g_fiat && (m *= i, f = (f *= i).toFixed(2), m = m.toFixed(r)),
			s += "<li title=" + n[5] + ' data-id="list-item" tid="' + n[6] + '" class="' + o + '">',
			s += '<span class="time" data-id="time">' + b + "</span>",
			s += '<span class="price" data-id="price">' + m + "</span>",
			s += '<span class="amount" data-id="amount">' + u + "</span>",
			s += '<span class="total" data-id="total">' + f + "</span>",
			s += "</li>"
		}
	return s
}
function get_bid_or_ask_decimals(e, t, a) {
	var i = t || "";
	a = a || !1;
	"" == i && (i = trade_global.symbol.split("_")[1].toUpperCase());
	var r = e,
	l = 1,
	s = typeof r;
	"object" == s && 0 < r.length && (l = r[0][0]),
	"string" != s && "number" != s || (l = r);
	var _,
	o = g_fiat;
	a && "" == o && (o = is_cn ? "CNY" : is_kr ? "KRW" : "USD");
	var n = l * (_ = get_global_fiat_rate(i, o));
	return {
		unitSymbol: get_currency_unitSymbol(i),
		fiat_rate_decimals: 10 <= n ? 2 : 1 <= n ? 3 : .1 <= n ? 4 : .01 <= n ? 5 : .001 <= n ? 6 : 7,
		fiat_rate: _
	}
}
function get_orderbook_vol_sum(e, t, a, i, r) {
	var l = 0;
	r <= 0 && (r = 1e-8);
	for (var s = 0; s < e.length && !(a < s); s++) {
		e[s];
		l += t ? parseFloat(e[s][1]) : parseFloat(e[s][2])
	}
	return t ? i || (l *= r) : i && (l /= r),
	l
}
function get_ask_bid_list_vol_sum(e, t, a) {
	var i = 0,
	r = 0;
	return g_ask_list && (i = get_orderbook_vol_sum(g_ask_list, 1, e, t, a)),
	g_bid_list && (r = get_orderbook_vol_sum(g_bid_list, 0, e, t, a)),
	i < r ? r : i
}
function build_order_table(e, t, a) {
	if (!e || !e[0])
		return "";
	var i = get_bid_or_ask_decimals(e),
	r = i.fiat_rate,
	l = i.fiat_rate_decimals;
	d = t ? 1 : 0;
	for (var s, _ = 0, o = 0; o < e.length && !(a < o); o++) {
		var n = {};
		t ? _ < parseFloat(e[o][1]) && (_ = parseFloat(e[o][1])) : _ < parseFloat(e[o][2]) && (_ = parseFloat(e[o][2]))
	}
	s = get_ask_bid_list_vol_sum(a, t, parseFloat(e[0][0]));
	var d,
	c = "",
	g = 0,
	p = 0,
	b = 0;
	for (o = 0; o < e.length; o++) {
		if (0 !=  + (n = e[o])[1]) {
			if (a < ++b)
				break;
			g += parseFloat(n[1]),
			p += parseFloat(n[2]);
			var u = parseFloat(n[0]).toFixed(g_cur_depth_precision.length - 2),
			f = n[1],
			m = n[2],
			k = p;
			"" != g_fiat && (m *= r, u *= r, k = (k *= r).toFixed(2), m = m.toFixed(2), u = u.toFixed(l)),
			v = t ? g : p;
			var h = Math.pow(v, .5) / Math.pow(s, .5) * 55;
			if (h < 1 && (h = 1), !(n.rate <= 0 || n.symbol_l <= 0 || n.symbol_r <= 0)) {
				var y = "onclick='set_price(" + d.toString() + "," + u + "," + g + "," + k + ")'";
				n.mine ? c += "<li  " + y + " class='orderline_mine'> " : c += "<li  " + y + ">",
				c += t ? '\t\t<span data-id= "price"  class= "price right-align" >' + u + '</span>   <span data-id= "volume" class= "volume right-align"  >' + f + '</span>  <span data-id= "total" class= "right-align total" >' + m + '</span>  <span data-id= "rect" class= "right-align rect orange" style="width: ' + h + 'px;"></span> ' : '<span data-id= "price"  class= "price right-align" >' + u + '</span>  <span data-id= "volume" class= "right-align volume"  >' + f + '</span>   <span data-id= "total" class= "right-align total" >' + m + '</span>   <span data-id= "rect" class= "right-align rect fenlv" style="width: ' + h + 'px;"></span>',
				c += "</li>"
			}
		}
	}
	return c
}
function latest_price_ischange(e, t, a) {
	var i = a || g_ask_list;
	if (!i && !(i = g_bid_list))
		return !1;
	var r = get_bid_or_ask_decimals(i),
	l = r.fiat_rate,
	s = r.fiat_rate_decimals,
	_ = get_element("orderbook_last_rate");
	"string" == typeof e && (e = parseFloat(e));
	var o = (e * l).toFixed(s);
	return _.innerHTML = o,
	setPageTitle(o),
	e != t && (_.className = t < e ? "red" : "green"),
	!0
}
function change_fiat_tags(e, t, a) {
	var i = "" == e ? a.toUpperCase() : e.toUpperCase();
	$(".currb-unit").text(i);
	var r = a;
	if ("" == e)
		get_element("orderbook_last_rate").innerHTML = g_latest_price, setPageTitle(g_latest_price), $(".ask-bid-price").find("span").html(a + "/" + t), $("#orderUnitSymbol").show(), $("#cnySymbol").hide();
	else {
		var l = get_element("orderbook_last_rate").innerHTML;
		latest_price_ischange(l, l),
		$(".ask-bid-price").find("span").html('<span class="red">' + e + "</span>/" + t),
		$("#orderUnitSymbol").hide(),
		$("#cnySymbol").show(),
		r = '<span class="red">' + e + "</span>"
	}
	$("#ask_total_label").find(".currb-unit").html(r),
	$("#bid_total_label").find(".currb-unit").html(r),
	build_left_side(e, a)
}
function build_left_side(e, t) {
	var a = ["btc", "eth", "usdt", "qtum", "custom"];
	if ("" != (e = e || g_fiat))
		for (var i in a) {
			g_left_side_price[a[i]] = [],
			d = [],
			c = $("#" + a[i] + "Tbody").find("tr");
			for (var r = 0; r < c.length; r++) {
				g = c.eq(r).attr("id");
				var l = c.eq(r).find(".left-price"),
				s = l.html();
				d[g] = s;
				var _ = parseFloat(s);
				if ("custom" == a[i])
					t = g.split("_")[2];
				else
					t = a[i];
				var o = get_bid_or_ask_decimals(_, t.toUpperCase()),
				n = o.fiat_rate_decimals;
				_ *= o.fiat_rate,
				l.text(_.toFixed(n))
			}
			$("#marketlist_btc").find(".left-price-type").text("(" + e + ")"),
			$("#marketlist_eth").find(".left-price-type").text("(" + e + ")"),
			$("#marketlist_usdt").find(".left-price-type").text("(" + e + ")"),
			$("#marketlist_qtum").find(".left-price-type").text("(" + e + ")"),
			g_left_side_price[a[i]] = d
		}
	else {
		if (void 0 === g_left_side_price.btc)
			return;
		for (var i in a)
			if (g_left_side_price[a[i]]) {
				var d = g_left_side_price[a[i]],
				c = $("#" + a[i] + "Tbody").find("tr");
				for (r = 0; r < c.length; r++) {
					var g = c.eq(r).attr("id");
					c.eq(r).find(".left-price").text(d[g])
				}
			}
		$("#marketlist_btc").find(".left-price-type").text("(BTC)"),
		$("#marketlist_eth").find(".left-price-type").text("(ETH)"),
		$("#marketlist_usdt").find(".left-price-type").text("(USDT)"),
		$("#marketlist_qtum").find(".left-price-type").text("(QTUM)")
	}
}
function merge_depth(e, t, a) {
	var i = [],
	r = {
		a: 0,
		b: 0
	};
	if (a)
		for (; r.a < e.length || r.b < t.length; )
			void 0 === e[r.a] ? i.push(t[r.b++]) : void 0 === t[r.b] ? i.push(e[r.a++]) : parseFloat(e[r.a][0]) > parseFloat(t[r.b][0]) ? i.push(t[r.b++]) : e[r.a][0] == t[r.b][0] ? (1e-8 < parseFloat(t[r.b][1]) ? i.push(t[r.b++]) : r.b++, r.a++) : i.push(e[r.a++]);
	else
		for (; r.a < e.length || r.b < t.length; )
			void 0 === e[r.a] ? i.push(t[r.b++]) : void 0 === t[r.b] ? i.push(e[r.a++]) : parseFloat(e[r.a][0]) < parseFloat(t[r.b][0]) ? i.push(t[r.b++]) : e[r.a][0] == t[r.b][0] ? (1e-8 < parseFloat(t[r.b][1]) ? i.push(t[r.b++]) : r.b++, r.a++) : i.push(e[r.a++]);
	return i
}
g_ask_list = datas_asks, g_bid_list = datas_bids, g_trade_list = datas_trades;
var market_name = trade_global.symbol.toUpperCase();
function get_rand_int(e) {
	return Math.floor(Math.random() * Math.floor(e))
}
var client_id = get_rand_int(1e7);
function socket_send_cmd(e, t, a, i) {
	a || (a = []);
	var r = {
		id: i || client_id,
		method: t,
		params: a
	};
	e.send(JSON.stringify(r))
}
var page_reloaded_time = Math.floor(Date.now() / 1e3), lockReconnect = !1, pollingLock = !1, connectTimes = 0;
reconnect = function (e, t) {
	t && (pollingLock = !1),
	lockReconnect || pollingLock || (lockReconnect = !0, connectTimes++, "undefined" != typeof reTimer && clearTimeout(reTimer), connectTimes < 4 ? reTimer = setTimeout(function () {
				start_websocket(wss_url),
				lockReconnect = !1
			}, 5e3) : (is_ie || (pollingData(e), pollingLock = !0), connectTimes = 0, lockReconnect = !1))
};
var socket, wss_url = "wss://webws.gateio.io/v3/", kMode = localStorage.getItem("klineMode") || "30,4";
function start_websocket(e) {
	"undefined" != typeof pingtimer && clearTimeout(pingtimer),
	(socket = new WebSocket(e + "?v=" + Math.floor(1e6 * Math.random()))).onopen = function () {
		console.log("Connected"),
		socket_send_cmd(socket, "server.ping");
		var e = genDecimals(global_precision_rate);
		socket_send_cmd(socket, "depth.subscribe", [market_name, 30, e]),
		socket_send_cmd(socket, "trades.subscribe", [market_name]),
		socket_send_cmd(socket, "ticker.subscribe", [market_name]),
		"undefined" != typeof global_price_watch_markets && socket_send_cmd(socket, "price.subscribe", global_price_watch_markets),
		!is_ie && socket_send_cmd(socket, "kline.subscribe", [market_name, timer_intervals_seconds[currLineMode[1]]])
	},
	socket.onerror = function (e) {
		console.log("ws Error "),
		reconnect(currLineMode),
		"undefined" != typeof pingtimer && clearTimeout(pingtimer)
	},
	socket.onclose = function (e) {
		console.log("ws Closed "),
		reconnect(currLineMode),
		"undefined" != typeof pingtimer && clearTimeout(pingtimer)
	},
	socket.onmessage = function (e) {
		if ($.cookie("socketUptTime", (new Date).getTime(), {
				expires: 20 / 24 / 60 / 60
			}), !is_ie && currLineMode.toString() != lineModeStore.toString()) {
			lineModeStore = currLineMode;
			var t = timer_intervals_seconds[currLineMode[1]];
			socket_send_cmd(socket, "kline.subscribe", [market_name, t]),
			history.pushState({}, "", "?k=" + t)
		}
		var a = JSON.parse(e.data);
		if ("pong" != a.result)
			switch (a.method) {
			case "depth.update":
				var i = a.params[0],
				r = a.params[1],
				l = r.asks,
				s = r.bids;
				if (l && l[0])
					for (var _ = 0; _ < l.length; _++)
						l[_][2] = l[_][0] * l[_][1], l[_][0] = Number(l[_][0]).toFixed(global_precision_rate), l[_][1] = Number(l[_][1]).toFixed(global_precision_vol), l[_][2] = Number(l[_][2]).toFixed(global_precision_total);
				if (s && s[0])
					for (_ = 0; _ < s.length; _++)
						s[_][2] = s[_][0] * s[_][1], s[_][0] = Number(s[_][0]).toFixed(global_precision_rate), s[_][1] = Number(s[_][1]).toFixed(global_precision_vol), s[_][2] = Number(s[_][2]).toFixed(global_precision_total);
				if (l && l[0]) {
					g_ask_list = !g_ask_list || i ? l : merge_depth(g_ask_list, l, 1),
					updateDepth(g_bid_list, g_ask_list);
					var o = build_order_table(g_ask_list, 1, 31);
					"" != o && (get_element("ul-ask-list").innerHTML = o)
				}
				if (s && s[0]) {
					g_bid_list = !g_bid_list || i ? s : merge_depth(g_bid_list, s, 0),
					updateDepth(g_bid_list, g_ask_list);
					var n = build_order_table(g_bid_list, 0, 31);
					"" != n && (get_element("ul-bid-list").innerHTML = n)
				}
				break;
			case "trades.update":
				var d = a.params[1],
				c = [];
				for (_ = 0; _ < d.length; _++) {
					var g = (H = d[_]).price,
					p = H.amount,
					b = g * p;
					g = Number(g).toFixed(global_precision_rate),
					p = Number(p).toFixed(global_precision_vol),
					b = Number(b).toFixed(global_precision_total),
					c.push(["", g, p, b, Math.floor(H.time), H.type, H.id])
				}
				if (c) {
					var u = $("#ul-trade-list"),
					f = u.find("li").length,
					m = u.data("tListData"),
					k = "";
					if (g_trade_list = c, null != m) {
						for (var h = [], v = [], y = 0; y < m.length; y++)
							h[m[y]] = !0;
						for (y = 0; y < c.length; y++)
							h[c[y]] || v.push(c[y]);
						"" != (k = build_trade_history_table(v)) && u.prepend(k)
					}
					99 < f && u.find("li:gt(23)").remove(),
					u.data("tListData", c)
				}
				break;
			case "ticker.update":
				var F = a.params[1],
				T = F.last,
				M = F.high,
				x = F.low,
				w = a.params[0].toLowerCase(),
				S = w.split("_")[1],
				L = 0;
				upDateTicker(F),
				g_latest_price = T,
				F.change && (L = F.change),
				change_price_percent([[T, L, "market_" + w + "_" + S, S]]);
				var D = Number(F.baseVolume).toFixed(2);
				is_cn ? 1e8 < D ? D = (D / 1e8).toFixed(2) + "亿" : 1e4 < D && (D = (D / 1e4).toFixed(2) + "万") : 1e6 < D ? D = (D / 1e6).toFixed(2) + "M" : 1e3 < D && (D = (D / 1e3).toFixed(2) + "K"),
				get_element("ticker_vol_b").innerHTML = D,
				get_element("tHigh").innerHTML = M,
				get_element("tLow").innerHTML = x;
				break;
			case "price.update":
				if (Date.now() / 1e3 - page_reloaded_time < 5)
					break;
				var C = a.params[0].toLowerCase(),
				U = C.split("_")[1],
				H = a.params[1],
				N = H.price,
				q = H.change;
				change_price_percent([[N, q, "market_" + C + "_" + U, U]]);
				break;
			case "kline.update":
				websocketData = a.params[0],
				addNewData(websocketData)
			}
		else
			pingtimer = setTimeout(function () {
					socket_send_cmd(socket, "server.ping")
				}, 1e4)
	}
}
lineModeStore = currLineMode = kMode.split(","), $(function () {
	start_websocket(wss_url)
});
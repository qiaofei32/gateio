/*

BTC_USDT,BCH_USDT,ETH_USDT,ETC_USDT,QTUM_USDT,LTC_USDT,DASH_USDT,ZEC_USDT,BTM_USDT,EOS_USDT,REQ_USDT,SNT_USDT,OMG_USDT,PAY_USDT,CVC_USDT,ZRX_USDT,TNT_USDT,XMR_USDT,XRP_USDT,DOGE_USDT,BAT_USDT,PST_USDT,BTG_USDT,DPY_USDT,LRC_USDT,STORJ_USDT,RDN_USDT,STX_USDT,KNC_USDT,LINK_USDT,CDT_USDT,AE_USDT,RLC_USDT,RCN_USDT,TRX_USDT,KICK_USDT,VET_USDT,MCO_USDT,FUN_USDT,DATA_USDT,ZSC_USDT,MDA_USDT,XTZ_USDT,GNT_USDT,GEM_USDT,RFR_USDT,DADI_USDT,ABT_USDT,OST_USDT,XLM_USDT,MOBI_USDT,OCN_USDT,ZPT_USDT,COFI_USDT,JNT_USDT,BLZ_USDT,GXS_USDT,MTN_USDT,RUFF_USDT,TNC_USDT,ZIL_USDT,TIO_USDT,BTO_USDT,THETA_USDT,DDD_USDT,MKR_USDT,DAI_USDT,SMT_USDT,MDT_USDT,MANA_USDT,LUN_USDT,SALT_USDT,FUEL_USDT,ELF_USDT,DRGN_USDT,GTC_USDT,QLC_USDT,DBC_USDT,BNTY_USDT,LEND_USDT,ICX_USDT,BTF_USDT,ADA_USDT,LSK_USDT,WAVES_USDT,BIFI_USDT,MDS_USDT,DGD_USDT,QASH_USDT,POWR_USDT,FIL_USDT,BCD_USDT,SBTC_USDT,GOD_USDT,BCX_USDT,HSR_USDT,QSP_USDT,INK_USDT,MED_USDT,BOT_USDT,QBT_USDT,TSL_USDT,GNX_USDT,NEO_USDT,GAS_USDT,IOTA_USDT,NAS_USDT,BCDN_USDT,SNET_USDT,BTS_USDT,BU_USDT,XMC_USDT,PPS_USDT,BOE_USDT,MEDX_USDT,CS_USDT,MAN_USDT,REM_USDT,LYM_USDT,ONT_USDT,BFT_USDT,IHT_USDT,SENC_USDT,TOMO_USDT,ELEC_USDT,HAV_USDT,SWTH_USDT,NKN_USDT,SOUL_USDT,LRN_USDT,EOSDAC_USDT,DOCK_USDT,GSE_USDT,RATING_USDT,HSC_USDT,HIT_USDT,DX_USDT,HC_USDT,GARD_USDT,FTI_USDT,SOP_USDT,LEMO_USDT,QKC_USDT,IOTX_USDT,RED_USDT,LBA_USDT,OPEN_USDT,MITH_USDT,SKM_USDT,XVG_USDT,NANO_USDT,HT_USDT,BNB_USDT,MET_USDT,TCT_USDT

*/

// var market_name = "ETH_USDT"
var socket, wss_url = "wss://webws.gateio.io/v3/";

function get_rand_int(e) {
	return Math.floor(Math.random() * Math.floor(e))
}
var client_id = get_rand_int(1e7);

function send_to_localserver(msg){
	var url = "http://localhost:8001/?data=" + encodeURIComponent(msg) + "&market_name=" + market_name;
	var img = new Image();
	img.src = url;
}


function socket_send_cmd(e, t, a, i) {
	a || (a = []);
	var r = {
		id: i || client_id,
		method: t,
		params: a
	};
	e.send(JSON.stringify(r))
}

reconnect = function () {
	start_websocket(wss_url)
};

function start_websocket(e) {

	(socket = new WebSocket(wss_url + "?v=" + Math.floor(1e6 * Math.random()))).onopen = function () {
			console.log("Connected"),
			socket_send_cmd(socket, "server.ping");
			socket_send_cmd(socket, "depth.subscribe", [market_name, 30, "0.01"]);
			// socket_send_cmd(socket, "trades.subscribe", [market_name]);
			// socket_send_cmd(socket, "ticker.subscribe", [market_name]);
	}
	socket.onerror = function (e) {
		console.log("ws Error");
		reconnect();
	},
	socket.onclose = function (e) {
		console.log("ws Closed");
		reconnect();
	},
	socket.onmessage = function (e) {
		send_to_localserver(e.data);
		var a = JSON.parse(e.data);
		if ("pong" != a.result){
			switch (a.method) {
			case "depth.update":
				var i = a.params[0],
				r = a.params[1],
				l = r.asks,
				s = r.bids;
				// console.log(r);
				console.log(JSON.stringify(r));
				break;
			case "trades.update":
				var d = a.params[1];
				console.log(JSON.stringify(d));
				break;
			case "ticker.update":
				var F = a.params[1],
				T = F.last,
				M = F.high,
				x = F.low,
				w = a.params[0].toLowerCase(),
				S = w.split("_")[1],
				L = 0;
				break;
			case "price.update":
				var C = a.params[0].toLowerCase(),
				U = C.split("_")[1],
				H = a.params[1],
				N = H.price,
				q = H.change;
				break;
			case "kline.update":
				websocketData = a.params[0];
				break;
			}
		} else {
			pingtimer = setTimeout(function () {
					socket_send_cmd(socket, "server.ping")
			}, 1e4);
		}
	}
}
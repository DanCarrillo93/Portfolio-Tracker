var searchBox = $("#searchBox");
var userInput = $("#search");
var cryptoSearchList = [];
var stockSearchList = [];
var currentStockSearches = [];
var currentCryptoSearches = [];

var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
	"/": "&#x2F;",
	"`": "&#x60;",
	"=": "&#x3D;",
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	});
}

function renderCrypto(cryptoAsset) {
	var symbol = escapeHtml(cryptoAsset.symbol);
	var name = escapeHtml(cryptoAsset.name);
	var price = escapeHtml(cryptoAsset.price.toFixed(5));
	var change = escapeHtml(cryptoAsset.percent_change_24h.toFixed(5));

	return $(`<section class="col s12 l6 card-panel black">
    <div class="col s12 card-panel black custom-shadow-crypto card-crypto">
        <div class="custom-flex">
            <h5 class="light-green-text text-accent-3">${symbol}</h5>
            <a data-symbol=${symbol} class="btn-floating btn-medium waves-effect waves-light black custom-shadow-crypto btn-save-crypto-widget">
                <i class="material-icons light-green-text text-accent-3 custom-shadow-crypto">add</i>
            </a>
        </div>
        <h5 class="light-green-text text-accent-3">${name}</h5>
        <h5 class="light-green-text text-accent-3">$ ${price}</h5>
        <div class="custom-flex">
            <h5 class="light-green-text text-accent-3">${change} %</h5>
            <a class="btn-floating btn-medium waves-effect waves-light black custom-shadow-crypto btn-remove-crypto-widget">
                <i class="material-icons light-green-text text-accent-3 custom-shadow-crypto">close</i>
            </a>
        </div>
    </div>
    </section>`);
}

function renderStock(stockAsset) {
	var symbol = escapeHtml(stockAsset.symbol);
	var name = escapeHtml(stockAsset.companyName);
	var price = escapeHtml(stockAsset.latestPrice.toFixed(2));
	var change = escapeHtml(stockAsset.changePercent.toFixed(2) * 100);

	return $(`<section class="col s12 l6 card-panel black">
    <div class="col s12 card-panel black custom-shadow-stocks card-stock">
        <div class="custom-flex">
            <h5 class="cyan-text text-accent-2">${symbol}</h5>
            <a data-symbol=${symbol} class="btn-floating btn-medium waves-effect waves-light black custom-shadow-stocks btn-save-stock-widget">
                <i class="material-icons cyan-text text-accent-2 custom-shadow-stocks">add</i>
            </a>
        </div>
        <h5 class="cyan-text text-accent-2">${name}</h5>
        <h5 class="cyan-text text-accent-2">$ ${price}</h5>
        <div class="custom-flex">
            <h5 class="cyan-text text-accent-2">${change} %</h5>
            <a class="btn-floating btn-medium waves-effect waves-light black custom-shadow-stocks btn-remove-stock-widget">
                <i class="material-icons cyan-text text-accent-2 custom-shadow-stocks">close</i>
            </a>
        </div>
    </div>
    </section>`);
}

$("#widgetContainer").on("click", ".btn-save-crypto-widget", function (event) {
	event.preventDefault();
	var symbol = $(this).attr("data-symbol");
	if (cryptoSearchList.indexOf(symbol) < 0) {
		cryptoSearchList.push(symbol);
		localStorage.setItem("Crypto", JSON.stringify(cryptoSearchList));
		$(this).addClass("hidden");
	}
});

$("#widgetContainer").on("click", ".btn-save-stock-widget", function (event) {
	event.preventDefault();
	var symbol = $(this).attr("data-symbol");
	if (stockSearchList.indexOf(symbol) < 0) {
		stockSearchList.push(symbol);
		localStorage.setItem("Stock", JSON.stringify(stockSearchList));
		$(this).addClass("hidden");
	}
});

$("#widgetContainer").on("click", ".btn-remove-stock-widget", function (event) {
	event.preventDefault();
	var symbol = $(this).attr("data-symbol");
	stockSearchList.splice($.inArray(symbol, stockSearchList), 1);
	localStorage.setItem("Stock", JSON.stringify(stockSearchList));
	location.reload();
});

$("#widgetContainer").on(
	"click",
	".btn-remove-crypto-widget",
	function (event) {
		event.preventDefault();
		var symbol = $(this).attr("data-symbol");
		cryptoSearchList.splice($.inArray(symbol, cryptoSearchList), 1);
		localStorage.setItem("Crypto", JSON.stringify(cryptoSearchList));
		location.reload();
	}
);

callLocalStorage();
$(searchBox).submit(function (event) {
	event.preventDefault();
	var symbol = userInput.val().toUpperCase();
	$(searchBox).trigger("reset");

	if ($.inArray(symbol, cryptoSymbols) > -1) {
		var requestUrl =
			"https://api.lunarcrush.com/v2?data=assets&key=zf4yj43rpvlvhcn0ln2c&symbol=" +
			symbol;
		fetch(requestUrl).then(function (crypto) {
			crypto.preventDefault;
			crypto.json().then(function (response) {
				if ($.inArray(symbol, cryptoSearchList) > -1) {
					return;
				} else if ($.inArray(symbol, currentCryptoSearches) > -1) {
					return;
				} else {
					var widget = renderCrypto(response.data[0]);
					$("#widgetContainer").append(widget);
					currentCryptoSearches.push(symbol);
				}
			});
		});
	} else if ($.inArray(symbol, stockSymbols) > -1) {
		var requestUrl =
			"https://cloud.iexapis.com/stable/stock/" +
			symbol +
			"/quote?token=pk_639e8892a36f446eb4aa5d54c433e9af";
		fetch(requestUrl).then(function (stock) {
			stock.preventDefault;
			stock.json().then(function (response) {
				if ($.inArray(symbol, stockSearchList) > -1) {
					return;
				} else if ($.inArray(symbol, currentStockSearches) > -1) {
					return;
				} else {
					var widget = renderStock(response);
					$("#widgetContainer").append(widget);
					currentStockSearches.push(symbol);
				}
			});
		});
	} else {
		return;
	}
});

function callLocalStorage() {
	var storedCrypto = JSON.parse(localStorage.getItem("Crypto"));
	var storedStock = JSON.parse(localStorage.getItem("Stock"));
	if ("Stock" in localStorage && "Crypto" in localStorage) {
		cryptoSearchList = storedCrypto;
		stockSearchList = storedStock;
		for (c = 0; c < storedCrypto.length; c++) {
			reloadCryptoWidget();
		}
		for (s = 0; s < storedStock.length; s++) {
			reloadStockWidget();
		}
	} else if ("Stock" in localStorage) {
		stockSearchList = storedStock;
		for (s = 0; s < storedStock.length; s++) {
			reloadStockWidget();
		}
	} else if ("Crypto" in localStorage) {
		cryptoSearchList = storedCrypto;
		for (c = 0; c < storedCrypto.length; c++) {
			reloadCryptoWidget();
		}
	} else {
		return;
	}
}

function reloadCryptoWidget() {
	var requestUrl =
		"https://api.lunarcrush.com/v2?data=assets&key=zf4yj43rpvlvhcn0ln2c&symbol=" +
		cryptoSearchList[c];
	fetch(requestUrl).then(function (crypto) {
		crypto.preventDefault;
		crypto.json().then(function (response) {
			var widget = renderCrypto(response.data[0]);
			$("#widgetContainer").append(widget);
			$(".btn-save-crypto-widget").addClass("hidden");
			$(".btn-remove-crypto-widget").addClass("display");
		});
	});
}

function reloadStockWidget() {
	var requestUrl =
		"https://cloud.iexapis.com/stable/stock/" +
		stockSearchList[s] +
		"/quote?token=pk_639e8892a36f446eb4aa5d54c433e9af";
	fetch(requestUrl).then(function (stock) {
		stock.preventDefault;
		stock.json().then(function (response) {
			var widget = renderStock(response);
			$("#widgetContainer").append(widget);
			$(".btn-save-stock-widget").addClass("hidden");
			$(".btn-remove-stock-widget").addClass("display");
		});
	});
}

var cryptoSymbols = [
	"ETH",
	"BTC",
	"XRP",
	"DOGE",
	"LTC",
	"BSV",
	"ETC",
	"BNB",
	"DOT",
	"LINK",
	"BCH",
	"EOS",
	"UNI",
	"USDT",
];
var stockSymbols = [
	"AAL",
	"AAPL",
	"ABNB",
	"ACB",
	"AMC",
	"AMD",
	"AMZN",
	"APHA",
	"ARKK",
	"BA",
	"BABA",
	"BAC",
	"BB",
	"BLNK",
	"BNGO",
	"CTRM",
	"CCIV",
	"CCL",
	"CGC",
	"CPRX",
	"CRON",
	"DAL",
	"DKNG",
	"ET",
	"F",
	"FB",
	"FCEL",
	"FUBO",
	"GE",
	"GM",
	"GME",
	"GNUS",
	"GOOGl",
	"GPRO",
	"GSAT",
	"HEXO",
	"IDEX",
	"INO",
	"IVR",
	"JBLU",
	"JNJ",
	"KO",
	"LUV",
	"MGM",
	"MRNA",
	"MRO",
	"NAK",
	"NAKD",
	"NCLH",
	"NFLX",
	"NIO",
	"NKE",
	"NKLA",
	"NNDM",
	"NOK",
	"NRZ",
	"NRZ",
	"NVDA",
	"OCGN",
	"OGI",
	"PENN",
	"PFE",
	"PLTR",
	"PLUG",
	"PSEC",
	"PTON",
	"PYPL",
	"RBLX",
	"RCL",
	"RIOT",
	"RYCEY",
	"SAVE",
	"SBUX",
	"SENS",
	"SIRI",
	"SNAP",
	"SNDL",
	"SONY",
	"SOS",
	"SPCE",
	"SPY",
	"SQ",
	"T",
	"TLRY",
	"TNXP",
	"TSLA",
	"TWTR",
	"TXMD",
	"UAL",
	"UBER",
	"VOO",
	"VTI",
	"WKHS",
	"WMT",
	"XOM",
	"XPEV",
	"ZM",
];

$(document).ready(function () {
	$("#search").autocomplete({
		data: {
			ETH: null,
			BTC: null,
			XRP: null,
			DOGE: null,
			LTC: null,
			BSV: null,
			ETC: null,
			BNB: null,
			DOT: null,
			LINK: null,
			BCH: null,
			EOS: null,
			UNI: null,
			USDT: null,
			AAL: null,
			AAPL: null,
			ABNB: null,
			ACB: null,
			AMC: null,
			AMD: null,
			AMZN: null,
			APHA: null,
			ARKK: null,
			BA: null,
			BABA: null,
			BAC: null,
			BB: null,
			BLNK: null,
			BNGO: null,
			CTRM: null,
			CCIV: null,
			CCL: null,
			CGC: null,
			CPRX: null,
			CRON: null,
			DAL: null,
			DKNG: null,
			ET: null,
			F: null,
			FB: null,
			FCEL: null,
			FUBO: null,
			GE: null,
			GM: null,
			GME: null,
			GNUS: null,
			GOOGl: null,
			GPRO: null,
			GSAT: null,
			HEXO: null,
			IDEX: null,
			INO: null,
			IVR: null,
			JBLU: null,
			JNJ: null,
			KO: null,
			LUV: null,
			MGM: null,
			MRNA: null,
			MRO: null,
			NAK: null,
			NAKD: null,
			NCLH: null,
			NFLX: null,
			NIO: null,
			NKE: null,
			NKLA: null,
			NNDM: null,
			NOK: null,
			NRZ: null,
			NRZ: null,
			NVDA: null,
			OCGN: null,
			OGI: null,
			PENN: null,
			PFE: null,
			PLTR: null,
			PLUG: null,
			PSEC: null,
			PTON: null,
			PYPL: null,
			RBLX: null,
			RCL: null,
			RIOT: null,
			RYCEY: null,
			SAVE: null,
			SBUX: null,
			SENS: null,
			SIRI: null,
			SNAP: null,
			SNDL: null,
			SONY: null,
			SOS: null,
			SPCE: null,
			SPY: null,
			SQ: null,
			T: null,
			TLRY: null,
			TNXP: null,
			TSLA: null,
			TWTR: null,
			TXMD: null,
			UAL: null,
			UBER: null,
			VOO: null,
			VTI: null,
			WKHS: null,
			WMT: null,
			XOM: null,
			XPEV: null,
			ZM: null,
		},
	});
});

$(document).ready(function () {
	$(".modal").modal();
});
$(document).ready(function () {
	$(".sidenav").sidenav();
});

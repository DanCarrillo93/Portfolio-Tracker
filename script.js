var searchBox = $("#searchBox");
var userInput = $("#search");
var symbol1 = $("#symbol1");
var name1 = $("#name1");
var price1 = $("#price1");
var percent1 = $("#percent1");
var symbol2 = $("#symbol2");
var name2 = $("#name2");
var price2 = $("#price2");
var percent2 = $("#percent2");
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
	}
});

$("#widgetContainer").on("click", ".btn-save-stock-widget", function (event) {
	event.preventDefault();
	var symbol = $(this).attr("data-symbol");
	if (stockSearchList.indexOf(symbol) < 0) {
		stockSearchList.push(symbol);
		localStorage.setItem("Stock", JSON.stringify(stockSearchList));
	}
});

$("#widgetContainer").on("click", ".btn-remove-stock-widget", function (event) {
	event.preventDefault();
	var symbol = $(this).attr("data-symbol");
	stockSearchList.splice($.inArray(symbol, stockSearchList), 1);
	localStorage.setItem("Stock", JSON.stringify(stockSearchList));
});

$("#widgetContainer").on(
	"click",
	".btn-remove-crypto-widget",
	function (event) {
		event.preventDefault();
		var symbol = $(this).attr("data-symbol");
		cryptoSearchList.splice($.inArray(symbol, cryptoSearchList), 1);
		localStorage.setItem("Crypto", JSON.stringify(cryptoSearchList));
	}
);

// var requestUrl = "https://api.polygon.io/v1/meta/exchanges?&apiKey=yBB3Vfx_GJ9mjTReRC00QSFJrGspuOKt";
// requestUrl.open("GET", url, true);
// requestUrl.onload = function(){
//     console.log(requestUrl);
// }

callLocalStorage();
$(searchBox).submit(function (event) {
	event.preventDefault();
	var symbol = userInput.val().toUpperCase();
	$(searchBox).trigger("reset");
	var cryptoSymbols = ["ETH", "BTC", "XRP", "DOGE", "LTC", "BSV", "ETC"];
	var stockSymbols = ["TSLA", "AAPL", "AMC", "GME"];

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

$(document).ready(function () {
	$("#search").autocomplete({
		data: {
			BTC: null,
			ETH: null,
			LTC: null,
			BSV: null,
			BCH: null,
			DOGE: null,
			ETC: null,
			TSLA: null,
			AAPL: null,
			AMC: null,
			GME: null,
		},
	});
});

$(document).ready(function () {
	$(".modal").modal();
});
$(document).ready(function () {
	$(".sidenav").sidenav();
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
		});
	});
}

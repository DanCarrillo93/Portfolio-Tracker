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

var stockSymbols = [
	"NFLX",
	"TSLA",
	"AAPL",
	"AMZN",
	"GOOGL",
	"FB",
	"PLTR",
	"NIO",
	"GME",
];

for (i = 0; i < 9; i += 1) {
	var requestUrl =
		"https://cloud.iexapis.com/stable/stock/" +
		stockSymbols[i] +
		"/quote?token=pk_639e8892a36f446eb4aa5d54c433e9af";
	fetch(requestUrl).then(function (stock) {
		stock.preventDefault;
		stock.json().then(function (response) {
			var widget = renderStock(response);
			$(".popular-stock-box").append(widget);
		});
	});
}

function renderStock(stockAsset) {
	var symbol = escapeHtml(stockAsset.symbol);
	var name = escapeHtml(stockAsset.companyName);
	var price = escapeHtml(stockAsset.latestPrice.toFixed(2));
	var change = escapeHtml(stockAsset.changePercent.toFixed(2) * 100);

	return $(`<section class="col s12 l4 card-panel black">
    <div class="col s12 card-panel black custom-shadow-stocks card-stock">
        <div class="custom-flex">
            <h5 class="cyan-text text-accent-2">${symbol}</h5>
            <a data-symbol=${symbol} class="btn-floating btn-medium waves-effect waves-light black custom-shadow-stocks">
                <i class="material-icons cyan-text text-accent-2 custom-shadow-stocks">add</i>
            </a>
        </div>
        <h5 class="cyan-text text-accent-2">${name}</h5>
        <h5 class="cyan-text text-accent-2">$ ${price}</h5>
        <div class="custom-flex">
            <h5 class="cyan-text text-accent-2">${change} %</h5>
            <a class="btn-floating btn-medium waves-effect waves-light black custom-shadow-stocks">
                <i class="material-icons cyan-text text-accent-2 custom-shadow-stocks">close</i>
            </a>
        </div>
    </div>
    </section>`);
}
$(document).ready(function () {
	$(".sidenav").sidenav();
});

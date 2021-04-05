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

for (i = 0; i < 9; i += 1) {
	var requestUrl =
		"https://api.lunarcrush.com/v2?data=assets&key=zf4yj43rpvlvhcn0ln2c&symbol=" +
		cryptoSymbols[i];
	fetch(requestUrl).then(function (crypto) {
		crypto.preventDefault;
		crypto.json().then(function (response) {
			var widget = renderCrypto(response.data[0]);
			$(".popular-crypto-box").append(widget);
		});
	});
}

function renderCrypto(cryptoAsset) {
	var symbol = escapeHtml(cryptoAsset.symbol);
	var name = escapeHtml(cryptoAsset.name);
	var price = escapeHtml(cryptoAsset.price);
	var change = escapeHtml(cryptoAsset.percent_change_24h);

	return $(`<section class="col s12 m6 l4 card-panel black">
    <div class="col s12 card-panel black custom-shadow-crypto card-crypto">
        <div class="custom-flex">
            <h5 class="light-green-text text-accent-3">${symbol}</h5>
            <a data-symbol=${symbol} class="btn-floating btn-medium waves-effect waves-light black custom-shadow-crypto">
                <i class="material-icons light-green-text text-accent-3 custom-shadow-crypto">add</i>
            </a>
        </div>
        <h5 class="light-green-text text-accent-3">${name}</h5>
        <h5 class="light-green-text text-accent-3">$ ${price}</h5>
        <div class="custom-flex">
            <h5 class="light-green-text text-accent-3">${change} %</h5>
            <a class="btn-floating btn-medium waves-effect waves-light black custom-shadow-crypto">
                <i class="material-icons light-green-text text-accent-3 custom-shadow-crypto">close</i>
            </a>
        </div>
    </div>
    </section>`);
}
$(document).ready(function () {
	$(".sidenav").sidenav();
});

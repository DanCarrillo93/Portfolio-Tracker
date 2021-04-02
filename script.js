var searchBox = $("#searchBox");
var userInput = $("#search");
var symbol1 = $("#symbol1")
var name1 = $("#name1");
var price1 = $("#price1");
var percent1 = $("#percent1");
var symbol2 = $("#symbol2")
var name2 = $("#name2");
var price2 = $("#price2");
var percent2 = $("#percent2");
var cryptoSearchList = [];
var stockSearchList = [];

$(searchBox).submit(function(event){
    event.preventDefault();
    var symbol = userInput.val().toUpperCase();
    $(searchBox).trigger("reset");
    var cryptoSymbols = ["ETH", "BTC", "XRP", "DOGE", "LTC", "BSV", "ETC" ];
    var stockSymbols = ["TSLA", "AAPL", "AMC", "GME"];


    if ($.inArray(symbol, cryptoSymbols) >= 0) {
        var requestUrl = "https://api.lunarcrush.com/v2?data=assets&key=zf4yj43rpvlvhcn0ln2c&symbol=" + symbol;
        fetch(requestUrl)
        .then(function(crypto) {
            crypto.preventDefault;
            crypto.json()
        .then(function(response) {
            if ($.inArray(symbol, cryptoSearchList) > -1) {
              return;  
            }
            else {
                cryptoSearchList.push(symbol);
                saveSymbolCrypto(cryptoSearchList); //Save LS and Array
                console.log(cryptoSearchList);
                $("#cryptoWidget").clone().appendTo("#widgetContainer");
                symbol2.html(response.data[0].symbol)
                name2.html(response.data[0].name);
                price2.html("$ " + response.data[0].price);
                percent2.html(response.data[0].percent_change_24h + " %");
                $("#cryptoWidget").css("display", "block");
            }
        });
        });
    }
    else if ($.inArray(symbol, stockSymbols) >= 0) {
        var requestUrl = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_639e8892a36f446eb4aa5d54c433e9af";
        fetch(requestUrl)
        .then(function(stock) {
            stock.preventDefault;
            stock.json()
            .then(function(response) {
                if ($.inArray(symbol, stockSearchList) > -1) {
                    return;  
                }
                else {
                stockSearchList.push(symbol);
                saveSymbolStock(stockSearchList); //Save Ls and Array
                console.log(stockSearchList);
                $("#stockWidget").clone().appendTo("#widgetContainer");
                symbol1.html(response.symbol)
                name1.html(response.companyName);
                price1.html("$ " + response.latestPrice);
                percent1.html(response.changePercent*100 + " %");
                $("#stockWidget").css("display", "block");
            }
        });
        });
    }
    else {
        return;
    };
});

$(document).ready(function() {
    $("#search").autocomplete( {
        data: {
            "BTC": null,
            "ETH": null,
            "LTC": null,
            "BSV": null,
            "BCH": null,
            "DOGE": null,
            "ETC": null,
            "TSLA": null,
            "AAPL": null,
            "AMC": null,
            "GME": null,
        },
    });
});

$(document).ready(function(){
    $('.modal').modal();
});
$(document).ready(function(){
    $('.sidenav').sidenav();
  });
function saveSymbolCrypto(symbol) {
    localStorage.setItem("Crypto" , JSON.stringify(symbol));
};
function saveSymbolStock(symbol) {
    localStorage.setItem("Stock" , JSON.stringify(symbol));
};

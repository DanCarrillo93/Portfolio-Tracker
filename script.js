var searchBox = $("#searchBox");
var userInput = $("#search");
var symbol1 = $("#symbol1")
var name1 = $("#name1");
var price1 = $("#price1");
var percent1 = $("#percent1");

$(searchBox).submit(function(event){
    event.preventDefault();
    var symbol = userInput.val();
    $(searchBox).trigger("reset");
    var compare = ["ETH", "BTC", "XRP", "DOGE"];
    var stockSymbols = ["TSLA", "APPL", "AMC", "GME"];
    if ($.inArray(symbol, compare) >= 0) {
        console.log("crypto");
        var requestUrl = "https://api.lunarcrush.com/v2?data=assets&key=zf4yj43rpvlvhcn0ln2c&symbol=" + symbol;
        fetch(requestUrl)
        .then(function(crypto){
            crypto.preventDefault;
            console.log(crypto);
            crypto.json()
        .then(function(response){
            console.log(response);
            symbol1.html(response.data[0].symbol)
            name1.html(response.data[0].name);
            price1.html("$ " + response.data[0].price);
            percent1.html(response.data[0].percent_change_24h + " %");
        })
        })
    }
    else if ($.inArray(symbol, stockSymbols) >= 0){
     console.log("works");
    }
    else {
        console.log("no matter");
        return;
    }
});


$(document).ready(function(){
    $("#search").autocomplete({
        data: {
            "BTC": null,
            "ETH": null,
            "LTC": null,
            "BSV": null,
            "BCH": null,
            "DOGE": null,
            "ETC": null,
        },
    });
});

$(document).ready(function(){
    $('.modal').modal();
});
var requestUrl = "https://api.lunarcrush.com/v2?data=assets&key=zf4yj43rpvlvhcn0ln2c&symbol=ETH"

    fetch(requestUrl)
        .then(function(crypto){
            crypto.preventDefault;
            console.log(crypto);
            crypto.json()
        .then(function(response){
            console.log(response);
            console.log(response.data[0].name);
            console.log(response.data[0].symbol);
            console.log(response.data[0].price);
            console.log(response.data[0].percent_change_24h);

    })
    });
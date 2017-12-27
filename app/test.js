'use strict';

var bittrex = require('./config/connection').bittrex;

// bittrex.getmarketsummaries((data, err) => {
//     if (err) {
//         return console.error(err);
//     }
//     for (var i in data.result) {
//         bittrex.getticker({
//             market: data.result[i].MarketName
//         }, (ticker) => {
//             console.log(ticker);
//         });
//     }
// });

//only get 100 records
// bittrex.getmarkethistory({market: 'USDT-OMG'}, (data, err) => {
//     if (err) {
//         return console.error(err);
//     }
//     return console.log(data.result.length);
// });

bittrex.getcandles({
    marketName: 'ETH-NEO',
    tickInterval: 'day'
}, (data, err) => {
    if (err){
        return console.error(err);
    }
    
    return console.log(data.result[157]);
});

// var max = data.result[0];
    // for(var i=1;i<data.result.length; i++) {
    //     if (max.BV < data.result[i].BV) {
    //         max = data.result[i];
    //     }
    // }
    // return console.log(max);


//////////Lấy markets
// bittrex.getmarkets((data, err) => {
//     if (err) {
//         return console.error(err);
//     }
//     var results = '';
//     for(var i=0; i<data.result.length; i++) {
//         if (data.result[i].BaseCurrency === "BTC"){
//             results = results+"\'"+data.result[i].BaseCurrency+"-"+data.result[i].MarketCurrency+"\', ";
//         }
//     }
//     return console.log(results);
// })
'use strict';
var Q = require("q");
var Price = require('../models/price');
var bittrex = require('../config/connection').bittrex;
var pairs = require('../config/pairs').BTC;


//Nhập market vào record
var insertPairs = () => {
    for(var i=0;i<pairs.length;i++){
        console.log(i);
        var newPrice = new Price();
        newPrice.market = pairs[i];
        newPrice.save();
    }
}

//cập nhật giá thấp nhất và các vùng giá, hàm cần khoảng 10s để hoàn thành
var getLowestPrices = () => {
    for(var i=0; i<pairs.length; i++){
        Price.findOne({'market': pairs[i]}, (err, price) => {
            if (err) {
                return console.error(err);
            }
            var pair = price.market;
            bittrex.getcandles({
                marketName: pair,
                tickInterval: 'day'
            }, (data, err) => {
                if (err){
                    return console.error(err);
                }
                var low = data.result[0].L;
                console.log(low);
                for(var j=1;j<data.result.length; j++) {
                    if (low > data.result[j].L) {
                        low = data.result[j].L;
                    }
                }

                price.low = low;
                price.high1 = (low*1.30).toFixed(8);
                price.high2 = (low*2).toFixed(8);
                price.high3 = (low*3).toFixed(8);
                price.save();
            });
        });
    }
    return console.log('Start');
}
getLowestPrices();

// cập nhật giá hiện tại
var updateNewestPrice = () => {
    for(var i=0; i<pairs.length; i++){
        Price.findOne({'market': pairs[i]}, (err, price) => {
            if (err) {
                return console.error(err);
            }
            var pair = price.market;
            bittrex.getmarketsummary({
                market: pair
            }, (data, err) => {
                if (err){
                    return console.error(err);
                }
                
                price.currentPrice = data.result[0].Last;
                console.log(price.currentPrice);
                // 0: loại, 1: mua, 2: có thể mua, 3: theo dõi
                if (price.currentPrice < price.high3) {
                    price.status = 3;
                } else {
                    price.status = 0;
                }
                if (price.currentPrice < price.high2) {
                    price.status = 2;
                }
                if (price.currentPrice < price.high1) {
                    price.status = 1;
                }
                if (price.currentPrice < price.low){
                    price.low = price.currentPrice;
                    price.high1 = (low*1.15).toFixed(8);
                    price.high2 = (low*1.30).toFixed(8);
                    price.high3 = (low*1.50).toFixed(8);
                    price.status = '1';
                } 
                price.save();
            });
        });
    }
    return console.log('start');
};

// Tìm coin < high3
var getStatus3 = () => {
    Price.find({'status': '3'}, (err, coins) => {
        if (err){
            return console.error(err);
        }
        return console.log(coins);
    });
}

// Tìm coin < high2
var getStatus2 = () => {
    Price.find({'status': '2'}, (err, coins) => {
        if (err){
            return console.error(err);
        }
        return console.log(coins);
    });
}

// Tìm coin < high1
var getStatus1 = () => {
    Price.find({'status': '1'}, (err, coins) => {
        if (err){
            return console.error(err);
        }
        return console.log(coins);
    });
}

// getStatus1();
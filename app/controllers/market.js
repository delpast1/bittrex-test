'use strict';
var Market = require('../models/market');
const bittrex = require('../config/connection').bittrex;
const markets = require('../config/markets').BTC;


//Nhập market vào record
var insertMarkets = () => {
    for(var i=0;i<markets.length;i++){
        console.log(i);
        var newMarket = new Market();
        newMarket.marketName = markets[i];
        newMarket.save();
        if (markets[i] === 'BTC-ENG') {
            return console.log('finish');
        }
    }
}

//cập nhật giá thấp nhất và các vùng giá, hàm cần khoảng 10s để hoàn thành
var getLowestPrices = () => {
    for(var i=0; i<markets.length; i++){
        Market.findOne({'marketName': markets[i]}, (err, market) => {
            if (err) {
                return console.error(err);
            }
            var marketName = market.marketName;
            bittrex.getcandles({
                marketName: marketName,
                tickInterval: 'day'
            }, (data, err) => {
                if (err){
                    return console.error(err);
                }
                var low = data.result[0];
                for(var j=1;j<data.result.length; j++) {
                    if (low.H > data.result[j].H) {
                        low = data.result[j];
                    }
                }

                market.date_low = low.T;
                market.low = low.H;
                market.high1 = (low.H*1.5).toFixed(8);
                market.high2 = (low.H*3).toFixed(8);
                market.high3 = (low.H*5).toFixed(8);
                market.save();
            });
            if (marketName === 'BTC-ENG') {
                return console.log('finish');
            }
        });
    }
}
// cập nhật giá hiện tại
var updateNewestPrice = (req, res) => {
    for(var i=0; i<markets.length; i++){
        Market.findOne({'marketName': markets[i]}, (err, market) => {
            if (err) {
                return console.error(err);
            }
            var marketName = market.marketName;
            bittrex.getmarketsummary({
                market: marketName
            }, (data, err) => {
                if (err){
                    return console.error(err);
                }
                
                market.currentPrice = data.result[0].Last;
                // 0: loại, 1: mua, 2: có thể mua, 3: theo dõi
                if (market.currentPrice < market.high3 && market.currentPrice > market.high2 ) {
                    market.status = 3;
                } else if (market.currentPrice < market.high2 && market.currentPrice > market.high1) {
                    market.status = 2;
                } else if (market.currentPrice < market.high1) {
                    market.status = 1;
                } else {
                    market.status = 0;
                } 
                market.save();
                if (marketName === 'BTC-ENG') {
                    return res.json('finish');
                }
            });
        });
    }
};

// Tìm coin < high3
var getStatus3 = (req, res) => {
    Market.find({'status': '3'}, (err, markets) => {
        if (err){
            return console.error(err);
        }
        let response = [];
        for (let i=0; i<markets.length; i++){
            response.push({
                marketName: markets[i].marketName,
                currentPrice: markets[i].currentPrice,
                status: markets[i].status
            });
        }
        return res.json({
            numberOfMarkets: response.length,
            markets: response
        });
    });
}

// Tìm coin < high2
var getStatus2 = (req, res) => {
    Market.find({'status': '2'}, (err, markets) => {
        if (err){
            return console.error(err);
        }
        let response = [];
        for (let i=0; i<markets.length; i++){
            response.push({
                marketName: markets[i].marketName,
                currentPrice: markets[i].currentPrice,
                status: markets[i].status,
                low:markets[i].low,
                high1:markets[i].high2
            });
        }
        return res.json({
            numberOfMarkets: response.length,
            markets: response
        });
    });
}

// Tìm coin < high1
var getStatus1 = (req, res) => {
    Market.find({'status': '1'}, (err, markets) => {
        if (err){
            return console.error(err);
        }
        let response = [];
        for (let i=0; i<markets.length; i++){
            response.push({
                marketName: markets[i].marketName,
                currentPrice: markets[i].currentPrice,
                status: markets[i].status,
                low:markets[i].low,
                high1:markets[i].high1
            });
        }
        return res.json({
            numberOfMarkets: response.length,
            markets: response
        });
    });
}

// insertMarkets();
// getLowestPrices();
// updateNewestPrice();
//getStatus1();
//getStatus2();
// getStatus3();

exports = module.exports = {
    getStatus1: getStatus1,
    getStatus2: getStatus2,
    getStatus3: getStatus3,
    updateNewestPrice: updateNewestPrice
}
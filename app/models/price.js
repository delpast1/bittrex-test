var mongoose = require('../config/db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Price', new Schema({
        market: String,
        low: Number,
        high1: Number,
        high2: Number,
        high3: Number,
        currentPrice: Number,
        status: String
}));
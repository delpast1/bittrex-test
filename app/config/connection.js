'use strict';

var bittrex = require('node-bittrex-api');

bittrex.options({
    'apikey': '53d0c3e31ace48049e37018097a6f588',
    'apisecret': '67af478bb1fd4be2ac0dfafeea406070'
});

module.exports = {
    bittrex: bittrex
}
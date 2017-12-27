var mongoose = require('mongoose');

mongoose.connect('mongodb://delpast1:123456@ds048368.mlab.com:48368/bittrex', {useMongoClient: true});

exports = module.exports = mongoose;
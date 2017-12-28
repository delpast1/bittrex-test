var express = require('express');
var router = express.Router();

const market = require('../app/controllers/market');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getstatus1', market.getStatus1);
router.get('/getstatus2', market.getStatus2);
router.get('/getstatus3', market.getStatus3);
router.get('/updateNewestPrice', market.updateNewestPrice);

module.exports = router;

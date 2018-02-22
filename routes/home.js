var express = require('express');
var router = express.Router();
var isLoggedIn = require('../config/utils').isLoggedIn;

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('home', {});
});

module.exports = router;

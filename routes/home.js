const express = require('express');
const router = express.Router();
let isLoggedIn = require('../config/utils').isLoggedIn;

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('home', {});
});

module.exports = router;

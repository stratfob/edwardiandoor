var express = require('express');
var router = express.Router();
var passport = require('passport');
var userMapper = require('../mappers/userMapper');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { message: req.flash('loginMessage') });
});

router.get('/.well-known/acme-challenge/p-J_6BV23g8QZfYGgmLJCQKrmtEwo0LhzaHS0X6di9E', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public', 'p-J_6BV23g8QZfYGgmLJCQKrmtEwo0LhzaHS0X6di9E'));
});

router.get('/.well-known/acme-challenge/ncIKETYfxE7mhslPhzFazetsBGalIFLvS2h6Lp6Vup8', function(req, res, next) {
        res.sendFile(path.join(__dirname, '../public', 'ncIKETYfxE7mhslPhzFazetsBGalIFLvS2h6Lp6Vup8'));
});

/* POST login details. */
router.post('/login', passport.authenticate('local-login', {
	successRedirect : '/home', // redirect to the secure profile section
	failureRedirect : '/login', // redirect back to the login page if there is an error
	failureFlash : true // allow flash messages
}));

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', {err: req.flash('err'), succ: req.flash('succ') });
});

router.post('/register', function(req,res){
	if (validUserParams(req.body)) {
		if (req.body.inputPassword === req.body.inputConfirmPassword) {
			//var {hash, salt} = hashing.createHash(req.body.inputPassword);

			userMapper.addUser(req.body.inputEmail, req.body.inputPassword,function(error, result) {
				if (!result) {
					req.flash('err', 'User could not be created');
				} else if (error) {
					req.flash('err', error);
				} else {
					req.flash('succ', 'Successfully created account!');
				}
				res.redirect('/login');
			});
		} else {
			req.flash('err', 'Passwords do not match');
			res.redirect('/register');
		}
	} else {
		req.flash('err', 'Not all details provided');
		res.redirect('/register');
	}
});

function validUserParams(body) {
	return (body.inputEmail && body.inputPassword && body.inputConfirmPassword);
}

module.exports = router;

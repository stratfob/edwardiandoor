const express = require('express');
const router = express.Router();
const passport = require('passport');
const userMapper = require('../mappers/userMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {});
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', {message: req.flash('loginMessage')});
});

router.get('/leaderboards', isLoggedIn, function(req,res){
	userMapper.allUsers(function(error, result){
		if(error){
			req.flash('err', 'An error occured');
            res.redirect('/home');
		}
		else {
            res.render('leaderboards', {user: req.user, result});
        }
	});
});

router.get('/home', isLoggedIn, function(req, res) {
    res.render('home', {user : req.user});
});

/* POST login details. */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}));

/* GET register page. */
router.get('/register', function (req, res) {
    res.render('register', {err: req.flash('err'), succ: req.flash('succ')});
});

router.post('/register', function(req,res){
	if (validUserParams(req.body)) {
		if (req.body.inputPassword === req.body.inputConfirmPassword) {

			userMapper.addUser(req.body.inputUsername, req.body.inputEmail, req.body.inputPassword,function(error, result) {
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
    return (body.inputUsername && body.inputEmail && body.inputPassword && body.inputConfirmPassword);
}

module.exports = router;

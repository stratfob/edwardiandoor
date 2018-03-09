const express = require('express');
const router = express.Router();
const passport = require('passport');
const userMapper = require('../mappers/userMapper');
const weaponMapper = require('../mappers/weaponMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;
const utils = require('../config/utils');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {});
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', {loginMessage: req.flash('loginMessage'), err: req.flash('err'), succ: req.flash('succ')});
});

router.get('/leaderboards/:pageNum', isLoggedIn, function(req,res){
	userMapper.allUsers(function(error, result){
		if(error){
			req.flash('err', 'An error occured');
            res.redirect('/home');
		}
		else {
			result = result.sort(function(a,b){return b.money - a.money});
			let numberOfPages = Math.floor(result.length/10);
			if(result.length%10>0){numberOfPages+=1;}
            res.render('leaderboards', {user: req.user, result, pageNumber:req.params.pageNum, numberOfPages});
        }
	});
});

router.get('/home', isLoggedIn, function(req, res) {
    res.render('home', {user : req.user,
		stealingLevel:utils.getLevelFromXp(req.user.stealingSkill),
		shootingLevel:utils.getLevelFromXp(req.user.shootingSkill),
		strengthLevel:utils.getLevelFromXp(req.user.strengthSkill),
		stealingPercentage:getPercentageProgress(req.user.stealingSkill),
		shootingPercentage:getPercentageProgress(req.user.shootingSkill),
		strengthPercentage:getPercentageProgress(req.user.strengthSkill)
    });
});


router.get('/shops', isLoggedIn, function(req, res) {
	weaponMapper.getHWWeapons(function(err,results){
        res.render('shops', {user : req.user, err: req.flash('err'), succ: req.flash('succ'), hwWeaponResults:results});
	});
});

router.get('/inventory',isLoggedIn, function(req,res){
    res.render('inventory', {user : req.user, err: req.flash('err'), succ: req.flash('succ'), weapons:req.user.weapons.sort()});
});

router.post('/shops/weapon',isLoggedIn,function (req,res) {
	weaponMapper.getWeapon(req.body.item,function(err,result){
		if(err){
            res.redirect('/shops');
		}
		else{
			if(req.user.money<result.cost){
                req.flash('err', 'You don\'t have enough money!');
                res.redirect('/shops');
			}
			else{
                userMapper.setMoney(req.user._id,req.user.money-result.cost,function(){});
                userMapper.addWeapon(req.user._id,req.body.item,function(){});
                req.flash('succ', req.body.item + ' purchased!');
                res.redirect('/shops');
			}
		}
	});
});

router.post('/equip',isLoggedIn,function(req,res){
	if(req.user.equippedWeapon!==null){
        req.flash('err', req.user.equippedWeapon + ' already equipped!');
	}
	else {
        userMapper.equipWeapon(req.user._id, req.body.item);
        req.flash('succ', req.body.item + ' equipped!');
    }
	res.redirect('/inventory');
});

router.post('/unequip',isLoggedIn,function(req,res){
    userMapper.unequipWeapon(req.user._id,req.body.item, function(){
        res.redirect('/inventory');
	});

});

router.get('/reports/:pageNum', isLoggedIn, function (req,res) {
    let reports = req.user.reports.sort(function(a,b){return b.date - a.date});
    let numberOfPages = Math.floor(reports.length/10);
    if(reports.length%10>0){numberOfPages+=1;}
	res.render('reports', {user:req.user, reports, pageNumber:req.params.pageNum, numberOfPages});
})

/* POST login details. */
router.post('/login', lowercaseifyEmail, passport.authenticate('local-login', {
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

			userMapper.addUser(req.body.inputUsername, req.body.inputEmail.toLowerCase(), req.body.inputPassword,function(error, result) {
				if (!result) {
					req.flash('err', 'Username/email is unavailable');
                    res.redirect('/register');
				} else if (error) {
					req.flash('err', error);
                    res.redirect('/register');
				} else {
					req.flash('succ', 'Successfully created account!');
                    res.redirect('/login');
				}

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

function lowercaseifyEmail(req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    return next();
}

function getPercentageProgress(skill){
    let nextLevelXp = utils.getXpRequiredForLevel(utils.getLevelFromXp(skill)+1);
    let currentLevelXp = utils.getXpRequiredForLevel(utils.getLevelFromXp(skill));
    return (skill-currentLevelXp)/(nextLevelXp-currentLevelXp)*100;
}

module.exports = router;

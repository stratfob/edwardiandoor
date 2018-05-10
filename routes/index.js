const express = require('express');
const router = express.Router();
const passport = require('passport');
const userMapper = require('../mappers/userMapper');
const weaponMapper = require('../mappers/weaponMapper');
const armourMapper = require('../mappers/armourMapper');
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
    res.render('home', {user : req.user,  err: req.flash('err'), succ: req.flash('succ'),
		stealingLevel:utils.getLevelFromXp(req.user.stealingSkill),
		shootingLevel:utils.getLevelFromXp(req.user.shootingSkill),
		strengthLevel:utils.getLevelFromXp(req.user.strengthSkill),
		stealingPercentage:getPercentageProgress(req.user.stealingSkill),
		shootingPercentage:getPercentageProgress(req.user.shootingSkill),
		strengthPercentage:getPercentageProgress(req.user.strengthSkill)
    });
});


router.get('/shops', isLoggedIn, function(req, res) {
	weaponMapper.getHWWeapons(function(err,HWResults){
		weaponMapper.getGunWeapons(function(err1,gunResults){
            armourMapper.getAllArmour(function(err2,armourResults){
                res.render('shops', {user : req.user, err: req.flash('err'), succ: req.flash('succ'), hwWeaponResults:HWResults,gunWeaponResults:gunResults,armourResults:armourResults});
            });            
		});
	});
});

router.get('/casino',isLoggedIn,function(req,res){
	res.render('casino',  {user : req.user, err: req.flash('err'), succ: req.flash('succ')});
});

router.post('/casino',isLoggedIn, function(req,res){
    if(req.user.health===0){
        req.flash('err', "You cannot start an activity when your health is 0!");
    }
    else if(req.user.money<req.body.betAmount){
        req.flash('err', 'You don\'t have enough money!');
        res.redirect('/casino');
    }
    else if(!req.user.currentActivity) {
        let timeRequired = 10000;
        userMapper.setMoney(req.user._id,req.user.money-req.body.betAmount,function(){});
        userMapper.setCurrentActivity(req.user._id, "Spinning roulette wheel", timeRequired,
            function(){ return resolveRoulette(Number(req.body.betAmount),req.user,req.body.rouletteOption, userMapper);}, function () {});
        req.flash('succ', "Spinning the wheel!");
    }
    else{
        req.flash('err', "Activity already in progress!");
    }
    res.redirect('/casino');
});

function resolveRoulette(betAmount, user, bet, mapper){
	if(Math.random()<0.5){
		if(bet==='red'){
            mapper.setMoney(user._id,user.money+(betAmount),function(){});
            mapper.addReport(user._id,"SUCCESS - Roulette spin came up red!", function(){});
		}
		else{
            mapper.addReport(user._id,"FAILURE - Roulette spin came up red!", function(){});
		}
	}else{
        if(bet==='black'){
            mapper.setMoney(user._id,user.money+(betAmount),function(){});
            mapper.addReport(user._id,"SUCCESS - Roulette spin came up black!", function(){});
        }
        else{
            mapper.addReport(user._id,"FAILURE - Roulette spin came up black!", function(){});
        }
	}
}

router.get('/criminals', isLoggedIn, function(req,res){
	res.redirect('/criminals/1');
});

router.get('/criminals/:pageNum', isLoggedIn, function(req,res){
    userMapper.allUsers(function(error,users){
        if(error){
            req.flash('err', 'An error occured');
            res.redirect('/home');
        }
        else {
            let criminals = users.sort(function (a, b) {return b.username - a.username});
            let numberOfPages = Math.floor(criminals.length / 10);
            if (criminals.length % 10 > 0) {
                numberOfPages += 1;
            }
            res.render('search', {user: req.user, criminals, pageNumber: req.params.pageNum, numberOfPages});
        }
	});
});

router.get('/reports/:pageNum', isLoggedIn, function (req,res) {
    let reports = req.user.reports.sort(function(a,b){return b.date - a.date});
    let numberOfPages = Math.floor(reports.length/10);
    if(reports.length%10>0){numberOfPages+=1;}
    res.render('reports', {user:req.user, reports, pageNumber:req.params.pageNum, numberOfPages});
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
                userMapper.addWeapon(req.user._id,1,req.body.item,function(){                    
                    req.flash('succ', req.body.item + ' purchased!');
                    res.redirect('/shops');
                });
			}
		}
	});
});

router.post('/shops/armour',isLoggedIn,function (req,res) {
	armourMapper.getArmour(req.body.item,function(err,result){
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
                userMapper.addArmour(req.user._id,1,req.body.item,function(){
                    req.flash('succ', req.body.item + ' purchased!');
                    res.redirect('/shops');
                });
			}
		}
	});
});


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

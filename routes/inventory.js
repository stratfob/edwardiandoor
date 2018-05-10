const express = require('express');
const router = express.Router();
const passport = require('passport');
const userMapper = require('../mappers/userMapper');
const weaponMapper = require('../mappers/weaponMapper');
const armourMapper = require('../mappers/armourMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;
const utils = require('../config/utils');


router.get('/',isLoggedIn, function(req,res){
    res.render('inventory', {user : req.user, err: req.flash('err'), succ: req.flash('succ'), weapons:req.user.weapons.sort(),armours:req.user.armours.sort()});
});

router.post('/equipWeapon',isLoggedIn,function(req,res){
	if(req.user.equippedWeapon!==null && req.user.equippedWeapon!==undefined){        
        userMapper.unequipWeapon(req.user._id,req.user.equippedWeapon, function(){
             req.flash('succ', req.body.item + ' equipped!');
             userMapper.equipWeapon(req.user._id, req.body.item,function(){
                 res.redirect('/inventory');
             });       
	    });        
	}
	else {        
        req.flash('succ', req.body.item + ' equipped!');
        userMapper.equipWeapon(req.user._id, req.body.item,function(){
            res.redirect('/inventory');
        });        
    }
	
});

router.post('/unequipWeapon',isLoggedIn,function(req,res){
    userMapper.unequipWeapon(req.user._id,req.body.item, function(){
        res.redirect('/inventory');
	});

});

router.post('/equipArmour',isLoggedIn,function(req,res){
	if(req.user.equippedArmour!==null && req.user.equippedArmour!==undefined){
        userMapper.unequipArmour(req.user._id,req.user.equippedArmour, function(){
            userMapper.equipArmour(req.user._id, req.body.item,function(){      
                req.flash('succ', req.body.item + ' equipped!');           
                res.redirect('/inventory');                 
            });            
	    });
	}
	else {
        userMapper.equipArmour(req.user._id, req.body.item,function(){
                req.flash('succ', req.body.item + ' equipped!');
                res.redirect('/inventory');                 
        });
    }
});

router.post('/unequipArmour',isLoggedIn,function(req,res){
    userMapper.unequipArmour(req.user._id,req.body.item, function(){
        res.redirect('/inventory');
	});

});

module.exports = router;
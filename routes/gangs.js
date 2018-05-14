const express = require('express');
const router = express.Router();
const passport = require('passport');
const userMapper = require('../mappers/userMapper');
const gangMapper = require('../mappers/gangMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;
const utils = require('../config/utils');


router.get('/',isLoggedIn, function(req,res){
    
    gangMapper.getAllGangs(function(err,gangs){
        gangMapper.getGangById(req.user.gang,function(error,userGang){            
             res.render('gangs', {user : req.user, err: req.flash('err'), succ: req.flash('succ'), gangs:gangs,userGang:userGang});  
        });
    });        
});

router.post('/create',isLoggedIn, function(req,res){
    
    var newGang = {
            name: req.body.name,
            members:[req.user._id],
            leader:req.user._id,
            moneyPool :0,
            reports:[]
   }    
    
    gangMapper.createGang(newGang,function(err,gangs){        
        res.redirect('/gangs');
    });    
    
});

router.post('/join/:gangId',isLoggedIn, function(req,res){
        
    userMapper.setUserGang(req.user._id,req.params.gangId,function(err,gangs){        
        res.redirect('/gangs');
    });    
    
});



module.exports = router;
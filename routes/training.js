const express = require('express');
const router = express.Router();
const userMapper = require('../mappers/userMapper');
const weaponMapper = require('../mappers/weaponMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;
const utils = require('../config/utils');


router.post('/shooting', isLoggedIn, function(req,res){
    if(req.user.health===0){
        req.flash('err', "You cannot start an activity when your health is 0!");
    }
    else if(!req.user.currentActivity) {
        let timeRequired;
        if (req.body.shootingType === "1") {
            timeRequired = 3600000;
        }
        else if (req.body.shootingType === "2") {
            timeRequired = 7200000;
        }
        else {
            timeRequired = 10800000;
        }
        userMapper.setCurrentActivity(req.user._id, "At the Shooting Range", timeRequired,
            function(){ return resolveShootingRange(Number(req.body.shootingType),req.user,userMapper,utils)}, function () {});
        req.flash('succ', "Training started!");
    }
    else{
        req.flash('err', "Activity already in progress!");
    }
    res.redirect('/shops');
});

router.post('/strength',isLoggedIn, function(req,res){
    if(req.user.health===0){
        req.flash('err', "You cannot start an activity when your health is 0!");
    }
    else if(!req.user.currentActivity) {
        let timeRequired;
        if (req.body.gymType === "1") {
            timeRequired = 3600000;
        }
        else if (req.body.gymType === "2") {
            timeRequired = 7200000;
        }
        else {
            timeRequired = 10800000;
        }
        userMapper.setCurrentActivity(req.user._id, "At the Gym", timeRequired,
            function(){ return resolveGym(Number(req.body.gymType),req.user,userMapper,utils)}, function () {});
        req.flash('succ', "Training started!");
    }
    else{
        req.flash('err', "Activity already in progress!");
    }
    res.redirect('/shops');
});

router.post('/hospital',isLoggedIn, function (req,res) {
    if(req.user.health===100){
        req.flash('err', "Your health is already full!");
        res.redirect('/home');
    }
    else if(!req.user.currentActivity) {
        let timeRequired;
        if (req.body.hospitalType === "1") {
            timeRequired = 21600000;
        }
        else if (req.body.hospitalType === "2") {
            timeRequired = 43200000;
        }
        else {
            timeRequired = 86400000;
        }
        userMapper.setCurrentActivity(req.user._id, "At the Hospital", timeRequired,
            function(){ return resolveHospital(Number(req.body.hospitalType),req.user,userMapper)}, function () {});
        req.flash('succ', "Began hospital stay!");
        res.redirect('/home');
    }
    else{
        req.flash('err', "Activity already in progress!");
        res.redirect('/home');
    }
});

function resolveHospital(hospitalType,user,mapper){
    switch(hospitalType){
        case 1:
            mapper.setHealth(user._id,user.health+25,function(){});
            break;
        case 2:
            mapper.setHealth(user._id,user.health+50,function(){});
            break;
        case 3:
            mapper.setHealth(user._id,user.health+75,function(){});
            break;
    }
}

function resolveShootingRange(shootingType, user, mapper, utils){
    let shootingLevel = utils.getLevelFromXp(user.shootingSkill);
    let shootingSkillIncrease;
    let chanceOfFailure = 0.05;
    switch(shootingType){
        case 1:
            if(Math.random()<chanceOfFailure){
                mapper.setHealth(user.id,user.health-25,function(){});
                mapper.addReport(user._id,"FAILURE - You shot yourself at the shooting range!", function(){});
            }
            else {
                shootingSkillIncrease = 1;
                mapper.setShootingSkill(user._id, user.shootingSkill + shootingSkillIncrease, function () {
                });
                mapper.addReport(user._id, "SUCCESS - You trained at the shooting range and increased your shooting skill by "
                    + shootingSkillIncrease, function () {
                });
            }
            break;
        case 2:
            if(shootingLevel<3){chanceOfFailure=0.15}
            if(Math.random()<chanceOfFailure){
                mapper.setHealth(user.id,user.health-50,function(){});
                mapper.addReport(user._id,"FAILURE - You shot yourself at the shooting range!", function(){});
            }else {
                shootingSkillIncrease = 3;
                mapper.setShootingSkill(user._id, user.shootingSkill + shootingSkillIncrease, function () {
                });
                mapper.addReport(user._id, "SUCCESS - You trained at the shooting range and increased your shooting skill by "
                    + shootingSkillIncrease, function () {
                });
            }
            break;
        default:
            if(shootingLevel<6){chanceOfFailure=0.15}
            if(shootingLevel<3){chanceOfFailure=0.40}
            if(Math.random()<chanceOfFailure){
                mapper.setHealth(user.id,user.health-75,function(){});
                mapper.addReport(user._id,"FAILURE - You shot yourself at the shooting range!", function(){});
            }else {
                shootingSkillIncrease = 5;
                mapper.setShootingSkill(user._id, user.shootingSkill + shootingSkillIncrease, function () {
                });
                mapper.addReport(user._id, "SUCCESS - You trained at the shooting range and increased your shooting skill by "
                    + shootingSkillIncrease, function () {
                });
            }
            break;
    }
}

function resolveGym(gymType, user, mapper, utils){
    let strengthLevel = utils.getLevelFromXp(user.strengthSkill);
    let strengthSkillIncrease;
    let chanceOfFailure = 0.05;
    switch(gymType){
        case 1:
            if(Math.random()<chanceOfFailure){
                mapper.setHealth(user.id,user.health-25,function(){});
                mapper.addReport(user._id,"FAILURE - You dropped a weight on your foot at the gym!", function(){});
            }
            else {
                strengthSkillIncrease = 1;
                mapper.setStrengthSkill(user._id, user.strengthSkill + strengthSkillIncrease, function () {
                });
                mapper.addReport(user._id, "SUCCESS - You trained at the gym and increased your strength by "
                    + strengthSkillIncrease, function () {
                });
            }
            break;
        case 2:
            if(strengthLevel<3){chanceOfFailure=0.15}
            if(Math.random()<chanceOfFailure){
                mapper.setHealth(user.id,user.health-50,function(){});
                mapper.addReport(user._id,"FAILURE - You dropped a weight on your foot at the gym!", function(){});
            }else {
                strengthSkillIncrease = 3;
                mapper.setStrengthSkill(user._id, user.strengthSkill + strengthSkillIncrease, function () {
                });
                mapper.addReport(user._id, "SUCCESS - You trained at the gym and increased your strength by "
                    + strengthSkillIncrease, function () {
                });
            }
            break;
        default:
            if(strengthLevel<6){chanceOfFailure=0.15}
            if(strengthLevel<3){chanceOfFailure=0.40}
            if(Math.random()<chanceOfFailure){
                mapper.setHealth(user.id,user.health-75,function(){});
                mapper.addReport(user._id,"FAILURE - You dropped a weight on your foot at the gym!", function(){});
            }else {
                strengthSkillIncrease = 5;
                mapper.setStrengthSkill(user._id, user.strengthSkill + strengthSkillIncrease, function () {
                });
                mapper.addReport(user._id, "SUCCESS - You trained at the gym and increased your strength by "
                    + strengthSkillIncrease, function () {
                });
            }
            break;
    }
}

module.exports = router;
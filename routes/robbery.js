const express = require('express');
const router = express.Router();
const userMapper = require('../mappers/userMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;
const utils = require('../config/utils');


router.post('/HW', isLoggedIn, function(req,res){

    if(!req.user.currentActivity) {
        if (req.body.robberyType === "1") {
            let timeRequired = 3600000;
            userMapper.setCurrentActivity(req.user._id, "Robbing Hardware Store", timeRequired,
                function(){ return resolveHardwareRobbery(1,req.user,userMapper,utils)}, function () {});
        }
        else if (req.body.robberyType === "2") {
            let timeRequired = 7200000;
            userMapper.setCurrentActivity(req.user._id, "Robbing Hardware Store", timeRequired,
                function(){ return resolveHardwareRobbery(2,req.user,userMapper,utils)}, function () {});
        }
        else {
            let timeRequired = 10800000;
            userMapper.setCurrentActivity(req.user._id, "Robbing Hardware Store", timeRequired,
                function(){ return resolveHardwareRobbery(3,req.user,userMapper,utils)}, function () {});
        }

        req.flash('succ', "Crime started!");
    }
    else{
        req.flash('err', "Activity already in progress!");
    }
    res.redirect('/shops');
});

function resolveHardwareRobbery(robberyType, user, mapper, utilities){
    let stealLevel = utilities.getLevelFromXp(user.stealingSkill);
    let rand = Math.random();
    let result;
    switch (robberyType){
        case 1:
            if(stealLevel===1){
                result = rand<0.75;
            }else if(stealLevel===2){
                result = rand<0.85;
            }else if(stealLevel===3){
                result = rand<0.9;
            }else if(stealLevel===4){
                result = rand<0.95;
            }else{
                result = true;
            }

            if(result){
                let reward = utilities.moneyReward(2,6);
                let stealingSkillIncrease = 1;
                mapper.setMoney(user._id,user.money+reward,function(){});
                mapper.setStealingSkill(user._id,user.stealingSkill+stealingSkillIncrease,function(){});
                mapper.addReport(user._id,"SUCCESS - You successfully stole small items worth " + reward +
                    "! Your stealing skill increased by 1xp.", function(){});
            }else{
                let jailTime = 3600000;
                mapper.setCurrentActivity(user._id, "Jail!", jailTime, function(){}, function (){});
                mapper.addReport(user._id,"FAILURE - You were arrested after trying to steal small items!", function(){});
            }


            break;
        case 2:
            if(stealLevel===1){
                result = rand<0.5;
            }else if(stealLevel===2){
                result = rand<0.6;
            }else if(stealLevel===3){
                result = rand<0.75;
            }else if(stealLevel===4){
                result = rand<0.8;
            }else if(stealLevel===5){
                result = rand<0.85;
            }else if(stealLevel===6){
                result = rand<0.9;
            }else if(stealLevel===7){
                result = rand<0.95;
            }else{
                result = true;
            }

            if(result){
                let reward = utilities.moneyReward(10,20);
                let stealingSkillIncrease = 3;
                mapper.setMoney(user._id,user.money+reward,function(){});
                mapper.setStealingSkill(user._id,user.stealingSkill+stealingSkillIncrease,function(){});
                mapper.addReport(user._id,"SUCCESS - You successfully stole a small tool worth " + reward +
                    "! Your stealing skill increased by 3xp.", function(){});
            }else{
                let jailTime = 7200000;
                mapper.setCurrentActivity(user._id, "Jail!", jailTime, function(){}, function (){});
                mapper.addReport(user._id,"FAILURE - You were arrested after trying to steal small tools!", function(){});
            }

            break;
        default:
            if(stealLevel===1){
                result = rand<0.25;
            }else if(stealLevel===2){
                result = rand<0.35;
            }else if(stealLevel===3){
                result = rand<0.5;
            }else if(stealLevel===4){
                result = rand<0.45;
            }else if(stealLevel===5){
                result = rand<0.5;
            }else if(stealLevel===6){
                result = rand<0.6;
            }else if(stealLevel===7){
                result = rand<0.7;
            }else if(stealLevel===8){
                result = rand<0.8;
            }else if(stealLevel===9){
                result = rand<0.9;
            }else{
                result = true;
            }

            if(result){
                let reward = utilities.moneyReward(50,80);
                let stealingSkillIncrease = 5;
                mapper.setMoney(user._id,user.money+reward,function(){});
                mapper.setStealingSkill(user._id,user.stealingSkill+stealingSkillIncrease,function(){});
                mapper.addReport(user._id,"SUCCESS - You successfully stole a large tool worth " + reward +
                    "! Your stealing skill increased by 5xp.", function(){});
            }else{
                let jailTime = 10800000;
                mapper.setCurrentActivity(user._id, "Jail!", jailTime, function(){}, function (){});
                mapper.addReport(user._id,"FAILURE - You were arrested after trying to steal a large tool!", function(){});
            }

            break;
    }

}



module.exports = router;
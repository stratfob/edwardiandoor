const express = require('express');
const router = express.Router();
const userMapper = require('../mappers/userMapper');
const weaponMapper = require('../mappers/weaponMapper');
const armourMapper = require('../mappers/armourMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;
const utils = require('../config/utils');


router.post('/HW', isLoggedIn, function(req,res){
    if(req.user.health===0){
        req.flash('err', "You cannot start an activity when your health is 0!");
    }

    else if(!req.user.currentActivity) {
        let timeRequired;
        if (req.body.robberyType === "1") {
            timeRequired =10;
        }
        else if (req.body.robberyType === "2") {
            timeRequired = 10;
        }
        else {
            timeRequired = 10;
        }

        userMapper.setCurrentActivity(req.user._id, "Robbing Hardware Store", timeRequired,
            function(){ return resolveHardwareRobbery(Number(req.body.robberyType),req.user,userMapper,utils)}, function () {});

        req.flash('succ', "Crime started!");
    }
    else{
        req.flash('err', "Activity already in progress!");
    }
    res.redirect('/shops');
});

router.post('/mug',isLoggedIn, function(req,res){
    if(req.user.health===0){
        req.flash('err', "You cannot start an activity when your health is 0!");
        res.redirect('/home');
    }
    else if(!req.user.currentActivity) {
        let victim = req.body.victim.toString();
        let timeRequired = 10;
        userMapper.findUserByUsername(victim,function(err,vic){
            if(err){
                req.flash('err', err);
                res.redirect('/home');
            }
            else if(vic.health === 0){
                req.flash('err', "Target is already unconscious!");
                res.redirect('/home');
            }
            else {
                userMapper.setCurrentActivity(req.user._id, "Mugging " + vic.username, timeRequired,
                    function () {
                        return resolveMugging(req.user, vic, userMapper, utils);
                    }, function () {
                    });

                req.flash('succ', "Crime started!");
                res.redirect('/home');
            }
        });
    }
    else{
        req.flash('err', "Activity already in progress!");
        res.redirect('/home');
    }

});

function resolveMugging(user,victim,mapper,utils){
    let userStrength = utils.getLevelFromXp(user.strengthSkill);
    let victimStrength = utils.getLevelFromXp(victim.strengthSkill);
    let userShooting = utils.getLevelFromXp(user.shootingSkill);
    let victimShooting = utils.getLevelFromXp(user.shootingSkill);
    let userHealth = user.health;
    let victimHealth = victim.health;
    let userReloadTime = 0;
    let victimReloadTime = 0;

    let userWeapon = user.equippedWeapon;
    let victimWeapon = victim.equippedWeapon;
    let userArmourName = user.equippedArmour;
    let victimArmourName = victim.equippedArmour;
    
    let reportContents = "";
    weaponMapper.getWeapon(userWeapon,function(err,UserWeapon){
        weaponMapper.getWeapon(victimWeapon,function(err2,VictimWeapon){
            armourMapper.getArmour(userArmourName,function(err3,userArmour){
                armourMapper.getArmour(victimArmourName,function(err4,victimArmour){
           
                    let roundNum = 1;
                    let UserShotsRemaining = UserWeapon.numberOfShots;
                    let VictimShotsRemaining = VictimWeapon.numberOfShots;

                    while(userHealth>0 && victimHealth>0){
                        if(UserShotsRemaining===0){
                            //reload
                            userReloadTime++;
                            if(userReloadTime===UserWeapon.reloadTime){
                                UserShotsRemaining = UserWeapon.numberOfShots;
                                userReloadTime = 0;
                                reportContents += (roundNum + ": " + user.username + " reloaded" + "\n");
                            }
                        }

                        if(roundNum%UserWeapon.attackRate===0 && UserShotsRemaining!==0){
                            if(UserWeapon.melee){
                                if(Math.random()<UserWeapon.baseHitPercentage){
                                    let damage = (Math.random() *
                                        (UserWeapon.damageRange.max-UserWeapon.damageRange.min) +
                                        UserWeapon.damageRange.min);
                                    damage += damage * (0.1*userStrength);
                                    blockStr = "";
                                    if(victimArmour){
                                        let blocked = damage * (0.01 * victimArmour.strength);
                                        damage -= blocked;
                                        blockStr =  "("+ blocked.toFixed(2) +" blocked)";
                                    }                                    
                                    victimHealth -= damage;
                                    reportContents += (roundNum + ": " + user.username + " dealt " +
                                        (Math.round(damage * 100) / 100).toFixed(2) +blockStr+" with " + UserWeapon.name + "\n");
                                }
                                else{
                                    reportContents += (roundNum + ": " + user.username + " missed!" + "\n");
                                }
                            }
                            else{
                                //guns
                                if(Math.random()<(UserWeapon.baseHitPercentage + UserWeapon.baseHitPercentage *
                                        (0.1*userShooting))){
                                    let damage = (Math.random() *
                                        (UserWeapon.damageRange.max-UserWeapon.damageRange.min) +
                                        UserWeapon.damageRange.min);
                                        blockStr = "";
                                    if(victimArmour){
                                        let blocked = damage * (0.01 * victimArmour.strength);
                                        damage -= blocked;
                                        blockStr =  "("+ blocked.toFixed(2) +" blocked)";
                                    }   
                                    victimHealth -= damage;
                                    reportContents += (roundNum + ": " + user.username + " dealt " +
                                        (Math.round(damage * 100) / 100).toFixed(2) +blockStr+ " with " + UserWeapon.name + "\n");
                                }
                                else{
                                    reportContents += (roundNum + ": " + user.username + " missed!" + "\n");
                                }
                            }
                            UserShotsRemaining--;
                        }

                        if(VictimShotsRemaining===0){
                            //reload
                            victimReloadTime++;
                            if(victimReloadTime===VictimWeapon.reloadTime){
                                VictimShotsRemaining = VictimWeapon.numberOfShots;
                                victimReloadTime = 0;
                                reportContents += (roundNum + ": " + victim.username + " reloaded" + "\n");
                            }
                        }
                        if(roundNum%VictimWeapon.attackRate===0 && VictimShotsRemaining!==0){
                            if(VictimWeapon.melee){
                                if(Math.random()<VictimWeapon.baseHitPercentage){
                                    let damage = (Math.random() *
                                        (VictimWeapon.damageRange.max-VictimWeapon.damageRange.min) +
                                        VictimWeapon.damageRange.min);
                                        blockStr = "";
                                    if(userArmour){
                                        let blocked = damage * (0.01 * userArmour.strength);
                                        damage -= blocked;
                                        blockStr =  "("+ blocked.toFixed(2) +" blocked)";
                                    }                        
                                    userHealth -= damage;
                                    reportContents += (roundNum + ": " + victim.username + " dealt " +
                                        (Math.round(damage * 100) / 100).toFixed(2) +blockStr+ " with " + VictimWeapon.name + "\n");
                                }
                                else{
                                    reportContents += (roundNum + ": " + victim.username + " missed!" + "\n");
                                }
                            }
                            else{
                                //guns
                                if(Math.random()<(VictimWeapon.baseHitPercentage + VictimWeapon.baseHitPercentage *
                                    (0.1*victimShooting))){
                                    let damage = (Math.random() *
                                        (VictimWeapon.damageRange.max-VictimWeapon.damageRange.min) +
                                        VictimWeapon.damageRange.min);
                                        blockStr = "";
                                    if(userArmour){
                                        let blocked = damage * (0.01 * userArmour.strength);
                                        damage -= blocked;
                                        blockStr =  "("+ blocked.toFixed(2) +" blocked)";
                                    }  
                                    userHealth -= damage;
                                    reportContents += (roundNum + ": " + victim.username + " dealt " +
                                        (Math.round(damage * 100) / 100).toFixed(2) +blockStr+ " with " + VictimWeapon.name + "\n");
                                }
                                else{
                                    reportContents += (roundNum + ": " + victim.username + " missed!" + "\n");
                                }
                            }
                            VictimShotsRemaining--;
                        }
                        roundNum++;
                    }

                    if(userHealth>0){
                        let moneyDifference = victim.money * 0.10;
                        mapper.addReport(user._id,"Success - You successfully mugged " + victim.username +
                            "! You stole $" + moneyDifference + "\n" + reportContents, function(){});
                        mapper.addReport(victim._id,"You were mugged by " + user.username + "! They stole $" +
                            moneyDifference + "\n" + reportContents, function(){});
                        mapper.setMoney(user._id,user.money+moneyDifference,function(){});
                        mapper.setMoney(victim._id,victim.money-moneyDifference,function(){});
                        mapper.setHealth(victim._id,victim.health-25,function(){});
                    }
                    else{
                        mapper.addReport(user._id,"Failure - You failed to mug " + victim.username + "!\n"
                            + reportContents, function(){});
                        mapper.addReport(victim._id,"You were mugged by " + user.username + ", but you fought them off!\n"
                            + reportContents, function(){});
                        mapper.setHealth(user._id,user.health-50,function(){});
                    }
                });
            });
        });
    });
}


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
                let jailTime = 1;
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
                let jailTime = 10;
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
                let jailTime = 10;
                mapper.setCurrentActivity(user._id, "Jail!", jailTime, function(){}, function (){});
                mapper.addReport(user._id,"FAILURE - You were arrested after trying to steal a large tool!", function(){});
            }

            break;
    }

}


module.exports = router;
User = require('../models/user');
const bcrypt = require('bcrypt');
const schedule = require('node-schedule');

function allUsers(callback){
	User.find(callback);
}

function addUser(username, email,password, callback){
	const newUser = new User({username:username, email:email, password:password, money:0, health:100, stealingSkill:0,
        strengthSkill:0,shootingSkill:0});
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    });
}

function setMoney(userID,newMoney,callback){
    User.findOneAndUpdate({_id:userID},{money:newMoney} , callback);
}

function setStealingSkill(userId,newSkill,callback){
    User.findOneAndUpdate({_id:userId},{stealingSkill:newSkill} , callback);
}

function setShootingSkill(userId,newSkill,callback){
    User.findOneAndUpdate({_id:userId},{shootingSkill:newSkill} , callback);
}

function setStrengthSkill(userId,newSkill,callback){
    User.findOneAndUpdate({_id:userId},{strengthSkill:newSkill} , callback);
}

function setHealth(userId,newHealth,callback){
    if(newHealth<0){
        newHealth=0;
    }
    if(newHealth>100){
        newHealth = 100;
    }
    User.findOneAndUpdate({_id:userId},{health:newHealth}, callback);
}

function addReport(userId, reportContents, callback){
    let report = {"date": Date.now(), "contents": reportContents};
    User.findOneAndUpdate({_id:userId}, {$push: {reports: report}}, callback);
}

function addWeapon(userId, amount, weaponName){
    User.findOne({_id:userId}, function (err,res) {
        let newWeapons = res.weapons;
        let hasWeapon = false;
        for (let i = 0; i < newWeapons.length; i++) {
            if (newWeapons[i].name === weaponName) {
                hasWeapon = true;
                newWeapons[i].amount+=amount;
                break;
            }
        }
        if(!hasWeapon){
            newWeapons.push({'name':weaponName,'amount':amount});
        }
        res.update({'weapons':newWeapons},function(){});
    });
}

function removeWeapon(userId, amount, weaponName){
    User.findOne({_id:userId}, function (err,res) {
        let newWeapons = [];

        for (let i = 0; i < res.weapons.length; i++) {
            if (res.weapons[i].name === weaponName) {
                if (res.weapons[i].amount > amount) {
                    newWeapons.push({'name': res.weapons[i].name, 'amount': res.weapons[i].amount - amount});
                }
            }
            else {
                newWeapons.push(res.weapons[i]);
            }
        }

        res.update({'weapons': newWeapons, 'equippedWeapon': weaponName}, function () {
        });
    });
}

function equipWeapon(userId, weaponName){
    User.findOne({_id:userId}, function (err,res) {
        if(res.equippedWeapon===null||res.equippedWeapon===undefined) {
            let newWeapons = [];

            for (let i = 0; i < res.weapons.length; i++) {
                if (res.weapons[i].name === weaponName) {
                    if (res.weapons[i].amount > 1) {
                        newWeapons.push({'name': res.weapons[i].name, 'amount': res.weapons[i].amount - 1});
                    }
                }
                else {
                    newWeapons.push(res.weapons[i]);
                }
            }

            res.update({'weapons': newWeapons, 'equippedWeapon': weaponName}, function () {
            });
        }
    });
}

function unequipWeapon(userId, weaponName, callback){
    User.findOneAndUpdate({_id:userId}, {equippedWeapon: null}, function(){
        addWeapon(userId,1,weaponName);
        callback();
    });
}

function addArmour(userId, amount, armourName){
    User.findOne({_id:userId}, function (err,res) {
        let newArmours = res.armours;
        let hasArmour = false;
        for (let i = 0; i < newArmours.length; i++) {
            if (newArmours[i].name === armourName) {
                hasArmour = true;
                newArmours[i].amount+=amount;
                break;
            }
        }
        if(!hasArmour){
            newArmours.push({'name':armourName,'amount':amount});
        }
        res.update({'armours':newArmours},function(){});
    });
}

function removeArmour(userId, amount, armourName){
    User.findOne({_id:userId}, function (err,res) {
        let newArmours = [];

        for (let i = 0; i < res.armours.length; i++) {
            if (res.armours[i].name === armourName) {
                if (res.armours[i].amount > amount) {
                    newArmours.push({'name': res.armours[i].name, 'amount': res.armours[i].amount - amount});
                }
            }
            else {
                newArmours.push(res.armours[i]);
            }
        }

        res.update({'armours': newArmours, 'equippedarmour': armourName}, function () {
        });
    });
}

function equipArmour(userId, armourName){
    User.findOne({_id:userId}, function (err,res) {
        if(res.equippedArmour===null||res.equippedArmour===undefined) {
            let newArmours = [];

            for (let i = 0; i < res.armours.length; i++) {
                if (res.armours[i].name === armourName) {
                    if (res.armours[i].amount > 1) {
                        newArmours.push({'name': res.armours[i].name, 'amount': res.armours[i].amount - 1});
                    }
                }
                else {
                    newArmours.push(res.armours[i]);
                }
            }

            res.update({'armours': newArmours, 'equippedArmour': armourName}, function () {
            });
        }
    });
}

function unequipArmour(userId, armourName, callback){
    User.findOneAndUpdate({_id:userId}, {equippedArmour: null}, function(){
        addArmour(userId,1,armourName);
        callback();
    });
}

function setCurrentActivity(userID, activityName, timeRequired, scheduleFunction, callback){
    let dateOfCompletion = new Date(Date.now() + timeRequired);
    User.findOneAndUpdate({_id: userID}, {currentActivity: activityName, activityEnd: dateOfCompletion}, callback);
    schedule.scheduleJob(dateOfCompletion, function () {
        User.findOneAndUpdate({_id:userID},{currentActivity:undefined, activityEnd:undefined} , callback);
        scheduleFunction();
    });
}

function findUserById(id,callback){
	User.find({ _id:id }, callback);
}

function findUserByUsername(username,callback){
	User.findOne({ username:username }, callback);
}

module.exports = {allUsers,addUser,findUserById, findUserByUsername, addWeapon,addArmour, setMoney, setStealingSkill,
    setShootingSkill, removeWeapon,removeArmour, setStrengthSkill, setHealth, addReport, equipWeapon,equipArmour, unequipWeapon,unequipArmour, setCurrentActivity};

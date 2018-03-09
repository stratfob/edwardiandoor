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

function addReport(userId, reportContents, callback){
    let report = {"date": Date.now(), "contents": reportContents};
    User.findOneAndUpdate({_id:userId}, {$push: {reports: report}}, callback);
}

function addWeapon(userId, weaponName){
    User.findOne({_id:userId}, function (err,res) {
        let newWeapons = res.weapons;
        let hasWeapon = false;
        for (let i = 0; i < newWeapons.length; i++) {
            if (newWeapons[i].name === weaponName) {
                hasWeapon = true;
                newWeapons[i].amount++;
                break;
            }
        }
        if(!hasWeapon){
            newWeapons.push({'name':weaponName,'amount':1});
        }
        res.update({'weapons':newWeapons},function(){});
    });
}

function equipWeapon(userId, weaponName){
    User.findOne({_id:userId}, function (err,res) {
        if(res.equippedWeapon===null) {
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
        addWeapon(userId,weaponName);
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

function findUserByEmail(email,callback){
	User.find({ email:email }, callback);
}

module.exports = {allUsers,addUser,findUserById,findUserByEmail, addWeapon, setMoney, setStealingSkill, addReport,
    equipWeapon, unequipWeapon, setCurrentActivity};

User = require('../models/user');
const bcrypt = require('bcrypt');
const schedule = require('node-schedule');

function allUsers(callback){
	User.find(callback);
}

function addUser(username, email,password, callback){
	const newUser = new User({username:username, email:email, password:password, money:0, health:100, stealingSkill:0});
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

module.exports = {allUsers,addUser,findUserById,findUserByEmail, setMoney, setStealingSkill, addReport, setCurrentActivity};

User = require('../models/user');

function allUsers(callback){
	User.find(function (err,users) {
		return callback(err,users);
	});
}

function addUser(email,password, callback){
    const newUser = new User({email: email, password: password});
    newUser.save(function (err,product) {
		return callback(err,product);
	});
}

function findUserById(id,callback){
	User.find({ _id:id }, function(err,res){
		return callback(err,res);
	});
}

function findUserByEmail(email,callback){
	User.find({ email:email }, function(err,res){
		return callback(err,res);
	});
}

module.exports = {allUsers,addUser,findUserById,findUserByEmail};

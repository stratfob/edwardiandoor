User = require('../models/user');
const bcrypt = require('bcrypt');

function allUsers(callback){
	User.find(callback);
}

function addUser(username, email,password, callback){
	const newUser = new User({username:username, email:email, password:password, knobs:0});
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    });
}

function findUserById(id,callback){
	User.find({ _id:id }, callback);
}

function findUserByEmail(email,callback){
	User.find({ email:email }, callback);
}

module.exports = {allUsers,addUser,findUserById,findUserByEmail};

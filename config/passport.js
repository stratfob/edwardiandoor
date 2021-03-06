const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

// expose this function to our app using module.exports
module.exports = function(passport) {


	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) { // callback with email and password from our form
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'email' :  email }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err){
				return done(err);
			}

			// if no user is found, return the message
			if (!user){
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
			}


            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if(isMatch){
                    // all is well, return successful user
                    return done(null, user);
				}
				else{
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
				}
            });
		});

	}));
};

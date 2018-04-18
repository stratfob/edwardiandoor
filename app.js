const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const weaponMapper = require('./mappers/weaponMapper');

const index = require('./routes/index');
const robbery = require('./routes/robbery');
const training = require('./routes/training');
const market = require('./routes/market');

const app = express();

//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/edwardiandoordb';
mongoose.connect(mongoDB);
//Get the default connection
mongoose.connection.on('connected', function () {
    weaponMapper.addAllWeapons(function () {});
    console.log('Mongoose default connection open to ' + mongoDB);
});
// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

require('./config/passport')(passport); // pass passport for configuration
app.use(session({
    secret: 'thisisthesecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/robbery', robbery);
app.use('/training',training);
app.use('/market',market);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

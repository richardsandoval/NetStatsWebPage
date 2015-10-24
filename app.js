var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cons = require('consolidate');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var LocalStrategy = require('passport-local').Strategy;

//Base de datos MongoDB
var dbConfig = require('./db');
var mongoose = require('mongoose');
//Connect to DB
mongoose.connect(dbConfig.url);

// Rutas
// var routes = require('./lib/routes/login')(passport);
var users = require('./lib/routes/users');
var home = require('./lib/routes/home');
var register = require('./lib/routes/signup');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'lib/views'));
app.engine('html', cons.swig);

app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, '/lib/public/vendor')));

app.use('/', routes);
app.use('/users', users);
app.use('/home', home);
app.use('/signup', register);


// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');


// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

/*
// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());
*/


// Initialize Passport
var initPassport = require('./lib/routes/init');
initPassport(passport);
var routes = require('./lib/routes/login')(passport);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.get('/pages/home', function(req, res){
  res.render('home', {
    title: 'Home'
  });
});

app.get('/pages/signup', function(req, res){
  res.render('register', {
    title: 'Home'
  });
});

module.exports = app;

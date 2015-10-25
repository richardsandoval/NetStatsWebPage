var express = require('express');
var path = require('path');
var cons = require('consolidate');


/*MiddleWares*/
var logger = require('morgan');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');


var app = express();
var UserController = require('./lib/controller/users');

var WSClient = require('./lib/wsclient');

var wsClient = new WSClient({
    uri: '10.0.0.3:8000/api/'
});

var usersController = new UserController(wsClient);

app.engine('html', cons.swig);

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'lib/views'));
app.set('port', process.env.PORT || '3000');

app.use(expressSession({
    cookie: {maxAge: 60000},
    secret: 'netstatsProject',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, '/lib/public')));

app.get('/login', usersController.login);
app.get('/login', usersController.processLogin());

app.get('*', usersController.login);

module.exports = app;

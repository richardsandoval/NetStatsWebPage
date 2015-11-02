var express = require('express');
var path = require('path');
var cons = require('consolidate');


/*MiddleWares*/
var logger = require('morgan');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var isAuthorized = require('./lib/middlewares/isauthorized.js');
var isAuthorizedRedirect = require('./lib/middlewares/isauthorized.js');


var app = express();
var UserController = require('./lib/controller/users');
var IndexController = require('./lib/controller/home');

var WSClient = require('./lib/wsclient');

var wsClient = new WSClient({
    uri: 'http://10.0.0.7:8000/api/'
});

var usersController = new UserController(wsClient);
var indexController = new IndexController(wsClient);

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
app.use('/static', express.static(path.join(__dirname, './lib/public/vendor')));

app.get('/', isAuthorized(), indexController.home());
app.get('/login', usersController.login);
app.get('/logout', usersController.logout());
app.post('/login', usersController.processLogin());

app.get('*', usersController.login);

module.exports = app;

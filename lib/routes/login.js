var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function (req, res, next) {

    var renderOpts = {
        title : 'NETSTAT',
        next : "home.html"
    };
    res.render('pages/login', renderOpts );
});

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/pages/login');
}

module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('pages/login', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('pages/login', passport.authenticate('login', {
        successRedirect: 'pages/home',
        failureRedirect: 'pages/login',
        failureFlash : true
    }));

    /* GET Registration Page */
    router.get('/', function(req, res){
        res.render('pages/signup',{message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('pages/signup', passport.authenticate('signup', {
        successRedirect: 'pages/home',
        failureRedirect: 'pages/signup',
        failureFlash : true
    }));

    /* GET Home Page */
    router.get('/', isAuthenticated, function(req, res){
        res.render('pages/home', { user: req.user });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('pages/home');
    });

    return router;
}

module.exports = router;

var LocalStrategy   = require('passport-local').Strategy;
var User = require('./users');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('login', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                // check in mongo if a user with username exists or not
                User.findOne({ 'username' :  username },
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if (!user){
                            console.log('User Not Found with username '+username);
                            return done(null, false, req.flash('message', 'User Not found.'));
                        }
                        // User exists but wrong password, log the error
                        if (!isValidPassword(user, password)){
                            console.log('Invalid Password');
                            return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, user);
                    }
                );

            })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

}
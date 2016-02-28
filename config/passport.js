/**
 * Created by rsandoval on 24/01/16.
 */
/**
 * Created by risandoval on 17/12/2015.
 */

/**
 * Passport configuration file where you should configure strategies
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;

var EXPIRES_IN_SECONDS = 60 * 60 * 24 * 365;
var SECRET = process.env.tokenSecret || "netstats";
var ALGORITHM = "HS256";
var ISSUER = "localhost";
var AUDIENCE = "localhost";

/**
 * Configuration object for local strategy
 */
var LOCAL_STRATEGY_CONFIG = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false
};

/**
 * Configuration object for JWT strategy
 */
var JWT_STRATEGY_CONFIG = {
    secretOrKey: SECRET,
    issuer: ISSUER,
    audience: AUDIENCE,
    passReqToCallback: false
};

/**
 * Triggers when user authenticates via local strategy
 * @param username
 * @param password
 * @param next
 * @private
 */
function _onLocalStrategyAuth(username, password, next) {
    User.findOne({username: username}).populateAll().exec(function (err, user) {
        if (err || !user) return next(err, false, {
            message: username + ' not found'
        });
        if (!CipherService.comparePassword(password, user)) {
            return next(null, false, {
                message: 'Incorrect password.'
            });
        }

        return next(null, user, {});

    });
}

/**
 * Triggers when user authenticates via JWT strategy
 */
function _onJwtStrategyAuth(payload, next) {
    var user = payload.user;
    return next(null, user, {});
}

passport.use(new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
passport.use(new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));

module.exports.jwtSettings = {
    expiresInSeconds: EXPIRES_IN_SECONDS,
    secret: SECRET,
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE
};

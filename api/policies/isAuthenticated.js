/**
 * Created by rsandoval on 19/02/16.
 */
var passport = require('passport');

module.exports = function (req, res, next) {
    passport.authenticate('jwt', function (error, user, info) {
        if (error) return res.serverError(error);
        if (!user || user == undefined)
            return res.unauthorized(null, info && info.code, info && info.message);

        req.user = user;


        next();
    })(req, res);
};


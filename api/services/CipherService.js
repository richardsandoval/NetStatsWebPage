/**
 * Created by rsandoval on 24/01/16.
 */

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports = {

    secret: sails.config.jwtSettings.secret,
    issuer: sails.config.jwtSettings.issuer,
    audience: sails.config.jwtSettings.audience,

    /**
     * Hash the password field of the passed user.
     * @param user
     */
    hashPassword: function (user) {
        if (user.password)
            user.password = bcrypt.hashSync(user.password);
    },

    /**
     * Compare user password hash with unhashed password
     * @param password
     * @param user
     */
    comparePassword: function (password, user) {
        return bcrypt.compareSync(password, user.password);
    },

    /**
     * Create a token based on the passed user
     * @param user
     */
    createToken: function (user) {
        return jwt.sign({
                user: user.username
            },
            sails.config.jwtSettings.secret,
            {
                algorithm: sails.config.jwtSettings.algorithm,
                expiresIn: sails.config.jwtSettings.expiresInSeconds,
                issuer: sails.config.jwtSettings.issuer,
                audience: sails.config.jwtSettings.audience
            }
        );
    }
};

/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

/**
 * Triggers when user authenticates via passport
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private
 */
function _onPassportAuth(req, res, error, user, info) {
    if (error) return res.serverError(error);
    if (!user) return res.unauthorized(null, info && info.code, info && info.message);

    return res.json({
        // TODO: replace with new type of cipher service
        error: {},
        data: {
            code: '00',
            status: true,
            token: CipherService.createToken(user),
            body: user
        }
    });
}


module.exports = {

    signup: function (req, res) {

        User.create(_.omit(req.allParams(), 'id'))
            .then(function (user) {

                return User.findOne(user.id).populateAll();

            })
            .then(res.created)
            .catch(res.serverError);
    },

    signin: function (req, res) {
        passport.authenticate('local',
            _onPassportAuth.bind(this, req, res))(req, res);
    }

};


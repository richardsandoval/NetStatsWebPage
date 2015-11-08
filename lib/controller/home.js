/**
 * Created by pascual on 04/10/15.
 */
var async = require('async');

var Index = module.exports = function (wsclient) {
    this.wsclient = wsclient;
};

Index.prototype.home = function () {

    var self = this;
    return function (req, res) {

        var errorHandle = function (err, req, res) {
            req.flash('info', err.message);
            res.redirect('/login');
        };
        var next = function (err, results) {
            if (err != null)
                return errorHandle(err, req, res);

            var account = results || {};

            console.log(req.url);
        };
        var renderOpts = {
            title : 'Home'
        };
        res.render('pages/home', renderOpts);
    };

};
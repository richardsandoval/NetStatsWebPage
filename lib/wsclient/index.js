/**
 * Created by rsandoval on 25/10/15.
 */

var url = require('url');
var debug = require('debug')('wsclient');
var request = require('request');

var WSClient = module.exports = function WSClient(opts) {
    this.opts = opts;
};

WSClient.prototype.buildUrl = function (uri) {
    return url.resolve(this.opts.uri, uri, '/');
};

WSClient.prototype.processRequest = function (opts, next) {
    debug('process request => %s', JSON.stringify(opts));

    request(opts, function (err, res, body) {

        debug('process response => %s', JSON.stringify(res));

        if (err != null)
            return next(err);

        if (res.statusCode === 200 || res.statusCode === 304) {

            if (!body.success) {
                return next(new Error(body.success))
            } else {
                return next(null, body);
            }

        } else {
            return next(new Error(res.statusCode));
        }

    });
};

WSClient.prototype.login = function (jsonBody, next) {
    var self = this;
    var options = {
        url: self.buildUrl('accounts/login/'),
        json: true,
        body: jsonBody,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    this.processRequest(options, next);
};
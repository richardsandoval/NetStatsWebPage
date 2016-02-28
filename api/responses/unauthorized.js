/**
 * Created by risandoval on 17/12/2015.
 */

/**
 * 401 (Unauthorized) Response
 * Similar to 403 Forbidden.
 * Specifically for authentication failed or not yet provided.
 */
module.exports = function (data, code, message, root) {
    var response = _.assign({
        data: data || {},
        error: {
            code: code ? code.toString() :  '401',
            status: false,
            message: message || 'Missing or invalid authentication token',
        }
    }, root);

    this.req._sails.log.silly('Sent (401 UNAUTHORIZED)\n', response);

    this.res.status(401);
    this.res.jsonx(response);
};

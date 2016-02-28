/**
 * Created by risandoval on 06/01/2016.
 */

module.exports = function sendOK(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;


    sails.log.silly('res.created() :: Sending 201 ("CREATED") response');

    res.status(201);

    var response = {
        error: {},
        data: {
            code: res.statusCode.toString(),
            message: 'Created correctly',
            status: true,
            body: data,
            token: data  ? data.email && data.device ? CipherService.createToken(data) : "" :  ""
        }
    };
    return res.jsonx(response);

};

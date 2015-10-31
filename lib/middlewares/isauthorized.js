/**
 * Created by rsandoval on 31/10/15.
 */

module.exports = function (){
    return function (req, res, next) {
        if (!req.session.user) return unauthorized(req, res);
        if (!req.session.user.session) return unauthorized(req, res);
        return next();
    }
};

function unauthorized(req, res) {
    var accept = req.headers.accept || '';
    var json = JSON.stringify({ message: 'Not found session' });
    res.statusCode = 401;
    if (accept.indexOf('html') > -1) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.redirect('/login');
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.end(json);
    }
}
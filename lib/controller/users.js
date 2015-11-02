var Users = module.exports = function Users(wsclient) {
    this.wsclient = wsclient;
};

Users.prototype.login = function (req, res) {

    var renderOpts = {
        title: 'Login Netstats',
        bodyClass: 'class=login'
    };
    var message = req.flash('info');
    if (message[0]) {
        renderOpts.message = message;
    }
    res.render('pages/login', renderOpts);
};

Users.prototype.processLogin = function () {
    var self = this;
    return function (req, res) {
        var next = function (err, token) {
            if (err !== null) {
                req.flash('info', err.message);
                res.redirect('/login');
            } else {
                req.session.user = {
                    username: req.body.username,
                    session: token.token
                };
                res.redirect('/');
            }
        };
        self.wsclient.login(req.body, next);
    };
};

Users.prototype.logout = function () {
    return function(req, res){
        req.session.destroy();
        return res.redirect('/login');
    }
};
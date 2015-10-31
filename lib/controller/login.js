var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var renderOpts = {
        title : 'NETSTAT',
        next : "home.html",
        message: 'Bienvenido a Netstats'
    };
    res.render('pages/login', renderOpts );
});

module.exports = router;

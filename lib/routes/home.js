/**
 * Created by pascual on 04/10/15.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var renderOpts = {
        title : 'NetStat Home',
    };
    res.render('pages/home', renderOpts );
});


module.exports = router;
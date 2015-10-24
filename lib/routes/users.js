var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  id: String,
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String
});
module.exports = router;

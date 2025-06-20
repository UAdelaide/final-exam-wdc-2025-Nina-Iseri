var express = require('express');
var router = express.Router();

/* GET api resources. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/dogs', function(req, res, next) {

});


router.get('/walkrequests:status', function(req, res, next) {

});


router.get('/walkers/', function(req, res, next) {

});

module.exports = router;

var express = require('express');
var Url     = require('../models/Url');
var router  = express.Router();

var urls = require('./api/urls');
var shortens = require('./api/shortens');

// This allow anyone to contact the API
router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


router.get('/', function(req, res) {
    var token;
    var authorization = req.get('Authorization');
    if(authorization) {
        token = /\s*token\s+(.*)$/.exec(authorization);
    } else {
        token = req.params.access_token;
    }
    //TODO: handle the authentication to the API
    // https://developer.github.com/v3/#authentication
    // https://stormpath.com/blog/the-problem-with-api-authentication-in-express/

});

// TODO : Adding tokens for external user to use API
router.get('/hello', function(req, res) {
    res.json({'hello' : 'world !'});
});

router.use('/urls', urls);
router.use('/shortens', shortens);

module.exports = router;

var express = require('express');
var Url = require('../models/Url');
var router = express.Router();

router.get('/hello', function(req, res, next) {
    res.json({'hello' : 'world !'});
});

router.get('/urls', function(req, res, next) {
    Url.findAll().then(function(urls) {
        res.json(urls);
    });
});

router.route('/urls/:url')
    .get(function(req, res) {
        var requestedUrl = decodeURI(req.params.url);
        console.log("In the route, requested url : "+requestedUrl);
        Url.findByUrl(requestedUrl).then(function(url) {
            res.json(url);
        });
    });

module.exports = router;

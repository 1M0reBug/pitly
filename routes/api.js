var express = require('express');
var Url = require('../models/Url');
var router = express.Router();

router.get('/hello', function(req, res, next) {
  res.json({'hello' : 'world !'});
});

router.get('/urls', function(req, res, next) {
  Url.findAll().then(function() {
    res.json(res);
  })
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Url = require('../models/Url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:shorten', function(req, res) {
  Url.findByShorten(req.params.shorten).then(function(found) {
    res.redirect(found.url);
  }, function(err) {
    res.status(400).render(err);
  });
});

module.exports = router;

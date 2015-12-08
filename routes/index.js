var express = require('express');
var router  = express.Router();
var Url     = require('../models/Url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// FIXME : Check if shorten is 5 characters
// TODO : Check if this shorten does no conflict with other routes
router.get('/:shorten', function(req, res) {
  Url.findByShorten(req.params.shorten).then(function(found) {
    res.redirect(found.url);
  }, function(err) {
    res.status(400).render(err);
  });
});

module.exports = router;

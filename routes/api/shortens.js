var express = require('express');
var Url = require('../../models/Url.js');
var router = express.Router();

// TODO: adding private or public shortens.
router.get('/:shorten', function(req, res) {
  Url.findByShorten(req.params.shorten).then(function(found) {
    res.json(found);
  }).then(null, function(error) {
    res.json(error);
  });
});

module.exports = router;

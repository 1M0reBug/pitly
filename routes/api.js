var express = require('express');
var Url = require('../models/Url');
var router = express.Router();

router.get('/hello', function(req, res, next) {
    res.json({'hello' : 'world !'});
});

router.route('/urls')
  .get(function(req, res, next) {

      if(req.query.url) {
        if(/\:\/\//.test(req.query.url)) req.query.url = encodeURIComponent(req.query.url);
        console.log(req.query.url);
        res.redirect('/api/urls/' + req.query.url);
      }

      if(req.query.shorten) {
        res.redirect('/api/shortens/'+req.query.shorten);
      }

      Url.findAll().then(function(urls) {
          res.json(urls);
      });
  })
  .post(function(req, res) {
    var url = new Url();
    try {
      url.setUrl(req.body.url);
      url.save().then(function(nUrl) {
        res.json(nUrl);
      });
    } catch(e) {
      console.warn(e);
      res.status(400).json(e);
    }
  });


router.route('/urls/:url')
    .get(function(req, res) {
        var requestedUrl = decodeURIComponent(req.params.url);
        Url.findByUrl(requestedUrl).then(function(url) {
            res.json(url);
        }).then(null, function(error) {
          res.json(error);
        });
    });

router.get('/shortens/:shorten', function(req, res) {
  Url.findByShorten(req.params.shorten).then(function(found) {
    res.json(found);
  }).then(null, function(error) {
    res.json(error);
  });
});

module.exports = router;

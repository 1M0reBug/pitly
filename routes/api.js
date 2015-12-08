var express = require('express');
var Url = require('../models/Url');
var router = express.Router();

router.get('/hello', function(req, res, next) {
    res.json({'hello' : 'world !'});
});

router.route('/urls')
  .get(function(req, res, next) {

      if(req.query.shorten) {
        res.redirect('/api/shortens/'+req.query.shorten);
      } else if(req.query.url) {
        if(/\:\/\//.test(req.query.url)) req.query.url = encodeURIComponent(req.query.url);
        console.log(req.query.url);
        res.redirect('/api/urls/' + req.query.url);
      } else {
          Url.findAll().then(function(urls) {
            res.json(urls);
        });
      }
  })
  .post(function(req, res) {
    var url = new Url();
    //url.url = req.body.url;
    Url.findByUrl(req.body.url).then(function(found){
      if(found) {
        console.log(found.url + ' already exists in the db');
        res.json(found);
      } else {
        console.log('Saving ' + req.body.url);
        url.url = req.body.url;
        url.save(function(err, nUrl) {
          if(err) {
            res.status(400).json(err);
          } else {
            res.json({url : nUrl.url, shorten : nUrl.shorten, _id : nUrl._id});
          }
        });
      }
    });
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

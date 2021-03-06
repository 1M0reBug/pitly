var express = require('express');
var Url     = require('../../models/Url');
var router  = express.Router();


// TODO : Pagination ! there could be a lot of urls
// TODO : If token, then give only the users url
// TODO : if registered return only user's URL.
router.route('/') // /urls
  .get(function(req, res) {

      if(req.query.shorten) {
        // TODO : test priority giving a shorten and not associated url
        res.redirect('/api/shortens/'+req.query.shorten);
      } else if(req.query.url) {
        if(/\:\/\//.test(req.query.url)) req.query.url = encodeURIComponent(req.query.url);
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
        res.json(found);
      } else {
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

// TODO: adding private or public URLs.
router.get('/:url', function(req, res) {
    var requestedUrl = decodeURIComponent(req.params.url);
    Url.findByUrl(requestedUrl).then(function(url) {
        res.json(url);
    }).then(null, function(error) {
      res.json(error);
    });
});


module.exports = router;

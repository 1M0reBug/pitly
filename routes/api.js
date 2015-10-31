var express = require('express');
var router = express.Router();

router.get('/hello', function(res, res, next) {
  res.json({'hello' : 'world !'});
});

module.exports = router;

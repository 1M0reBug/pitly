var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var UrlSchema = new Schema({
  "url" : String,
  "shorten" : String
});

UrlSchema.statics.findAll = function() {
  return this.find({}).exec(); // return Promise
};

UrlSchema.statics.findByUrl = function(url) {
  return this.findOne({"url" : url}).exec();
};

UrlSchema.statics.findByShorten = function(_shorten) {
  return this.findOne({shorten : _shorten}).exec();
};

UrlSchema.methods.shortenify = function() {
  this.shorten = crypto.createHash('sha1').update(this.url).digest('hex').substr(0,5);
};

// TODO : problem of scope, can't use this.findOne !
UrlSchema.methods.setUrl = function(_url) {
  this.findOne({"url" :_url}).exec(function(found, err) {
    if(!found) {
      this.url = _url;
      this.shortenify();
    } else {
      throw new Exception('The url already exists');
    }
  });
};


var UrlModel;

try{
  UrlModel = mongoose.model('Url', UrlSchema);
} catch(e) {
  UrlModel = mongoose.model('Url');
}

module.exports = UrlModel;

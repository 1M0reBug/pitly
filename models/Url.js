var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var UrlSchema = new Schema({
  "url" : String,
  "shorten" : {type : String, unique : true}
});

UrlSchema.pre('save', function(next) {
  var self = this;
  this.shortenify(null, function(_shorten) {
    console.log('returned from shortenify with shorten : ' + _shorten);
    self.shorten = _shorten;
    next();
  });
});

UrlSchema.statics.findAll = function() {
  return this.find({}).select('-__v').exec(); // return Promise
};

UrlSchema.statics.findByUrl = function(url) {
  return this.findOne({"url" : url}).select('-__v').exec();
};

UrlSchema.statics.findByShorten = function(_shorten) {
  return this.findOne({shorten : _shorten}).select('-__v').exec();
};

UrlSchema.methods.shortenify = function(url, cb) {
  url = url || this.url;
  cb(crypto.createHash('sha1').update(url).digest('hex').substr(0,5));
};

var UrlModel;

try{
  UrlModel = mongoose.model('Url', UrlSchema);
} catch(e) {
  UrlModel = mongoose.model('Url');
}

module.exports = UrlModel;

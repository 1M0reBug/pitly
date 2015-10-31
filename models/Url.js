var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  "url" : String,
  "shorten" : String
});

UrlSchema.statics.findAll = function() {
  return this.find({}).exec(); // return Promise
}

var UrlModel;

try{
  UrlModel = mongoose.model('Url', UrlSchema);
} catch(e) {
  UrlModel = mongoose.model('Url');
}

module.exports = UrlModel;

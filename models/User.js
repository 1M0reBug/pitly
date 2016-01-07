var mongoose = require('mongoose');
var crypto = require('crypto');
var Promise = require('promise');

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var UserSchema = new mongoose.Schema({
    "name": String,
    "surname": String,
    "mail": {
        type: String,
        validate: {
            validator: validateEmail,
            msg: "{VALUE} is no valid email !"
        }
    },
    "password": String
});

UserSchema.statics.encryptPwd = function(pwd, cb) {
    var salt = crypto.randomBytes(20);
    crypto.pbkdf2(pwd, salt, 10000, 512, cb);
};

UserSchema.pre('save', function(next) {
    this.name = this.name.toLowerCase();
    this.surname = this.surname.toLowerCase();
    // see -> http://stackoverflow.com/a/19526326 TODO: add salt and encryption of passwords
    // FIXME : 'this.encryptPwd is not a function' failing the test
    var self = this;
    UserSchema.statics.encryptPwd(this.password, function(err, key) {
       self.password = key;
        next();
    });
});




UserSchema.statics.findAll = function() {
    return this.find().select('-v').exec();
};

var UserModel;

try {
    UserModel = mongoose.model('User', UserSchema);
} catch(e) {
    UserModel = mongoose.model('User');
}


module.exports = UserModel;

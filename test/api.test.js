var mocha = require('mocha'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    request = require('supertest'),
    www = require('../bin/www'), // launch the server
    url = "http://localhost:3000",
    mongoose = require('mongoose'),
    Url = require('../models/Url');


require('sinon-as-promised');
chai.use(chaiAsPromised);


describe('Routing', function() {
    var cleanUrlCollection = function() {
        mongoose.connection.collections.urls.drop();
    };

    var populateDatabase = function() {
        var url1 = new Url({
            "url" : "http://www.my-brand-new-url.com",
            "shorten" : "12345"
        });

        var url2 = new Url({
            "url" : "http://www.another-url.com",
            "shorten" : "15237"
        });

        return url1.save().then(function() {
            return url2.save();
        });
    };


    describe('GET /api/hello', function() {
        it('should display Hello World message', function(done) {
            request(url)
                .get('/api/hello')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    expect(err).to.not.exist;
                    expect(res).to.exist;

                    expect(res.body).to.have.property('hello');
                    expect(res.body.hello).to.be.equal('world !');
                    done();
                });
        }); // end hello message
    }); // end #hello

    describe('GET /api/urls', function() {

        beforeEach(function() {
            cleanUrlCollection();
        });

        after(function() {
            cleanUrlCollection();
        });

        it('should display all the added URLs', function(done) {
            populateDatabase().then(function() {
                request(url)
                    .get('/api/urls')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        expect(res.body.length).to.equal(2);
                        done();
                    });
            });
        });

        it('should display the shorten of a given url', function(done) {
            var toUrl = encodeURI("http://www.another-url.com");
            populateDatabase().then(function() {
                request(url)
                    .get('/api/urls/' + toUrl)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        expect(err).to.not.exist;
                        expect(res.body).to.have.property('shorten');
                        done();
                    });
            });
        });
    }); // end GET /api/urls
}); // end Pitly

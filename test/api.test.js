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

    beforeEach(function() {
      cleanUrlCollection();
    });

    var populateDatabase = function() {
        var url1 = new Url({
            "url" : "http://www.my-brand-new-url.com",
            "shorten" : "12345"
        });

        var url2 = new Url({
            "url" : "http://www.another-url.com",
            "shorten" : "15237"
        });

        return url1.save()
          .then(function(url1) {
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
            var askedURL = "http://www.my-brand-new-url.com";
            var toUrl = encodeURIComponent(askedURL);
            populateDatabase().then(function(element) {
                request(url)
                    .get('/api/urls/' + toUrl)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        expect(err).to.not.exist;
                        expect(res.body).to.have.property('url');
                        expect(res.body).to.have.property('shorten');
                        expect(res.body.url).to.be.equal(askedURL);
                        done();
                    });
            });
        });
    }); // end GET /api/urls
    describe('GET /urls?url=:url', function(){
        it('should redirect to /urls/:url using encodeURI URL', function(done) {
          var askedURL = "http://www.my-brand-new-url.com";
          populateDatabase().then(function(){
            request(url)
              .get('/api/urls?url=' + encodeURIComponent(askedURL))
              .expect(302)
              .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.header.location).to.equal('/api/urls/' + encodeURIComponent(askedURL));

                done();
              });

          });
        });

        it('should redirect to /urls/:url using clean URL', function(done) {
          var askedURL = "http://www.my-brand-new-url.com";
          populateDatabase().then(function(){
            request(url)
              .get('/api/urls?url=' + askedURL)
              .expect(302)
              .end(function(err, res){
                expect(res.header.location).to.equal('/api/urls/' + encodeURIComponent(askedURL));
                done();
              });

          });
        });
    }); // end GET /urls?url=:url


    describe('GET /api/urls?shorten=:shorten', function() {
      it('should display the expected shortened url', function(done) {

        populateDatabase().then(function(last) {
          var shorten = last.shorten;
          request(url)
            .get('/api/urls?shorten=' + shorten)
            .expect(302)
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.header.location).to.equal('/api/shortens/' + shorten);
                done();
            });
        });
      });
    });

    describe('POST /api/urls', function() {

        it('should add a new url', function(done) {
          request(url)
            .post('/api/urls')
            .send({url : "http://a-new-url.com"})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.have.property('url', 'http://a-new-url.com');
              expect(res.body).to.have.property('shorten');

              done();
            });
       });

       it('shouldn\'t add twice the same url', function(done) {
         request(url)
          .post('/api/urls')
          .send({url : 'http://a-new-url.com'})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res){
            var id = res.body._id;
            request(url)
             .post('/api/urls')
             .send({url : 'http://a-new-url.com'})
             .expect(200)
             .expect('Content-Type', /json/)
             .end(function(err, res){
               expect(res.body).to.have.property('url', 'http://a-new-url.com');
               expect(res.body).to.have.property('_id', id);
               done();
             });
          });
       });
    }); // end POST /api/urls


    describe('GET /:shorten', function() {
      it('should redirect to the correct URL', function(done) {
        populateDatabase().then(function(last) {
          var givenShorten = last.shorten;
          request(url)
            .get('/' + givenShorten)
            .expect(302)
            .end(function(err, res) {
              expect(err).to.not.exist;
              expect(res.header.location).to.equal(last.url);
              done();
            });
        });
      });
    });
}); // end Pitly

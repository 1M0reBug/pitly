var mocha = require('mocha'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    chaiAsPromised = require('chai-as-promised'),
    request = require('supertest'),
    www = require('../bin/www'),
    url = "http://localhost:3000",
    Url = require('../models/Url');

require('sinon-as-promised');
chai.use(chaiAsPromised);

describe('Routing', function() {
  describe('GET /api/hello', function() {

    it('should display Hello World message', function(done) {
      request(url)
        .get('/api/hello')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          should.exist(res);

          expect(res.body).to.have.property('hello');
          expect(res.body.hello).to.be.equal('world !');
          done();
        });
    }); // end hello message
  }); // end #hello

  describe('GET /api/urls', function() {
    it('should display all the added URLs', function(done) {

      var stubUrl = sinon.stub(Url, 'findAll');
      stubUrl.resolves({"url" : "http://localhost", "shorten" : "12345"});

      request(url)
        .get('/api/urls')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          //should.not.exist(err);
          //should.exist(res);
          expect(res.body).to.eventually.be.at.least(1).notify(done);
          stubUrl.restore();
        });
    });
  });
}); // end Pitly

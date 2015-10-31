var mocha = require('mocha'),
    sinon = require('sinon'),
    expect = require('chai').expect,
    should = require('chai').should(),
    request = require('supertest'),
    www = require('../bin/www')
    url = "http://localhost:3000";


describe('Routing', function() {
  describe('#hello', function() {

    it('should display Hello World message', function(done) {
      request(url)
        .get('/api/hello')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          should.exist(res);

          res.body.should.have.property('hello');
          res.body.hello.should.equal('world !');
          done();
        });
    }); // end hello message
  }); // end #hello
}); // end Pitly

mocha = require 'mocha'
sinon = require 'sinon'
expect = require('chai').expect
request = require 'supertest'
www = '../bin/www'
mongoose = require 'mongoose'
url = 'http://localhost:3000'
Url = require '../models/Url'


describe 'Routing', ->
  cleanUrlCollection = ->
    mongoose.connection.collections.urls.drop()
    return

  populateDatabase = ->
    url1 = new Url url: "http://my-first-url.com", shorten: "12345"
    url2 = new Url url: "http://my-second-url.com", shorten: "15426"

    url1.save().then ->
      url2.save()

  beforeEach ->
    cleanUrlCollection()
    return

  after ->
    cleanUrlCollection()
    mongoose.connection.close()
    return

  describe 'GET /api/hello', ->
    it 'should display Hello World Message', (done)->
      request(url)
        .get '/api/hello'
        .expect 'Content-Type', /json/
        .expect 200
        .end (err, res)->
          expect(res.body).to.have.property('hello', 'world !')
          done()
          return

  describe 'GET /api/urls', ->
    it 'should display all the added URLS', (done)->
      populateDatabase().then ->
        request url
          .get '/api/urls'
          .expect 200
          .expect 'Content-Type', /json/
          .end (err, res)->
            expect(err).to.not.exist
            expect(res.body.length).to.equal 2
            done()
            return
        return

    it 'should display the shorten of a given url', (done)->
      askedUrl = "http://my-first-url.com"
      toUtl = encodeURIComponent(askedUrl)
      populateDatabase().then (element)->
        request url
          .get "/api/urls/#{toUrl}"
          .expect 200
          .expect 'Content-Type', /json/
          .end (err, res)->
            expect(err).to.not.exist
            expect(res.body).to.have.property 'url', askedUrl
            expect(res.body).to.have.property 'shorten'
            done()
            return

  describe 'GET /api/urls?url=:url', ->
    it 'should redirect to /api/urls/:url', (done)->
      askedURL = 'http://my-first-url.com'
      toUri = encodeURIComponent(askedURL)
      populateDatabase().then ->
        request url
          .get "/api/urls?url=#{toUri}"
          .expect 302
          .end (err, res)->
            expect(err).to.not.exist
            expect(res.header.location).to.equal "/api/urls/#{toUri}"
            done()
            return

    it 'should redirect to /api/urls/:url using clean URL', (done)->
      askedURL = 'http://my-first-url.com'
      toUri = encodeURIComponent(askedURL)
      populateDatabase().then ->
        request url
          .get "/api/urls?url=#{askedURL}"
          .expect 302
          .end (err, res)->
            expect(err).to.not.exist
            expect(res.header.location).to.equal("/api/urls/#{toUri}")
            done()
            return

  describe 'GET /api/shortens/:shorten', ->
    it 'should display the expected url', (done)->
      populateDatabase().then (last)->
        shorten = last.shorten
        id = last._id
        request url
          .get "/api/shortens/#{shorten}"
          .expect 200
          .expect 'Content-Type', /json/
          .end (err, res)->
            expect(res.body._id).to.equal
            done()
            return

  describe 'GET /api/urls?shorten=:shorten', ->
    it 'should display the expected shortened url', (done)->
      populateDatabase().then (last)->
        shorten = last.shorten
        request url
          .get "/api/urls?shorten=#{shorten}"
          .expect(302)
          .end (err, res)->
            expect(err).to.no.exist
            expext(res.header.location).to.equal "/api/shotens/#{shorten}"
            done()
            return


  describe 'POST /api/urls', ->
    it 'should add a new url', (done)->
      request url
        .post '/api/urls'
        .send url: 'http://a-new-url.com'
        .expect 200
        .expect 'Content-Type', /json/
        .end (err, res)->
            expect(err).to.not.exist
            expect(res.body).to.have.property 'url', 'http://a-new-url.com'
            expect(res.body).to.have.property 'shorten'
            done()
            return

    it 'shoud not add twice the same url', ->
      request url
        .post '/api/url'
        .send url: 'http://a-new-url.com'
        .expect 200
        .expect 'Content-Type', /json/
        .end (err, res)->
          id = res.body._id
          request url
            .post '/api/urls'
            .send url: 'http://a-new-url.com'
            .expect 200
            .expect 'Content-Type', /json/
            .end (e, r)->
              expect(r.body).to.have.property 'url', 'http://a-new-url.com'
              expect(r.body).to.have.property 'shorten'
              expect(r.body).to.have.property 'id', id
              done()
              return

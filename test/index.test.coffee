mocha = require 'mocha'
sinon = require 'sinon'
expect = require('chai').expect
request = require 'supertest'
www = require '../bin/www'
mongoose = require 'mongoose'
Url = require '../models/Url'
url = 'http://localhost:3000'
db = mongoose.createConnection()

describe '/', ->

  cleanUrlCollection = ->
    db.collections.urls.drop()

  populateDatabase = ->
    url1 = new Url url: "http://www.my-brand-new-url.com", shorten: "12345"
    url2 = new Url url: "http://www.another-url.com", shorten: "15625"

    url1.save().then ->
      url2.save()

  before ->
    db.open('mongodb://localhost:27017/pitly')
    Url = db.model('Url', Url.schema)
    return

  after ->
    cleanUrlCollection()
    db.close ->
      console.log 'connection closed'
    return

  beforeEach ->
    cleanUrlCollection()
    return

  describe 'GET /:shorten', ->
    it 'should redirect to the correct URL', (done)->
      populateDatabase().then (last)->
        givenShorten = last.shorten
        request url
          .get "/#{givenShorten}"
          .expect 302
          .end (err, res)->
            expect(err).to.not.exist
            expect(res.header.location).to.equal(last.url)
            done()
            return
        return
      return

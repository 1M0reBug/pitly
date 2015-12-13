mocha = require 'mocha'
sinon = require 'sinon'
expect = require('chai').expect
mongoose = require 'mongoose'
Url = require '../models/Url'
request = require 'supertest'
www = require '../bin/www'
url = 'http://localhost:3000'

describe '/', ->

  cleanUrlCollection = ->
    mongoose.connection.collections.urls.drop()
    return

  populateDatabase = ->
    url1 = new Url url: "http://www.my-brand-new-url.com"
    url2 = new Url url: "http://another-url.com"

  url1.save().then ->
    url2.save()


  after ->
    cleanUrlCollection()
    mongoose.connection.close()
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

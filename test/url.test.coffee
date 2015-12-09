mocha = require 'mocha'
sinon = require 'sinon'
chai = require 'chai'
expect = chai.expect
mongoose = require 'mongoose'
Url = require '../models/Url'

# mongoose.connect('mongodb://localhost:27017/pitly')


describe 'Url', ->

  cleanUrlCollection = ->
    mongoose.connection.collections.urls.drop()

  after ->
    cleanUrlCollection()
    mongoose.connection.close()
    console.log 'connection closed'
    return

  beforeEach ->
    cleanUrlCollection()
    return


  populateDatabase = ->
    url1 = new Url url: "http://www.my-brand-new-url.com", shorten: "12345"
    url2 = new Url url: "http://www.another-url.com", shorten: "15625"

    url1.save().then ->
      url2.save()

  describe '#findAll', ->
    it 'should return all added urls', (done)->
      populateDatabase().then ->
        Url.findAll().then (all)->
          expect(all.length).to.be.equal 2
          expect(all[1]).to.have.property 'url'
          expect(all[1]).to.have.property 'shorten'
          done()
          return
        return
      return

  describe '#findByUrl', ->
    it 'should return a url from it\'s url', (done)->
      id = ""
      populateDatabase().then (last)->
        id = last._id.toString();
        url = last.url;
        Url.findByUrl(url)
      .then (found)->
        expect(found._id.toString()).to.equal id
        done()
        return
      return
    return

  describe '#findByShorten', ->
    it 'should return a url by its shorten', (done)->
      shorten = ""
      id = ""
      populateDatabase().then (last)->
          shorten = last.shorten
          id = last._id.toString()
          Url.findByShorten(shorten)
      .then (found)->
        expect(found.shorten).to.equal shorten
        expect(found._id.toString()).to.equal id
        done()
        return
      return
    return

  describe '#shortenify', ->
    it 'should always return the same shorten', (done)->
      url1 = new Url()
      url1.url = 'http://shoretn-url.com';
      shorten1 = ""
      url1.shortenify().then (shorten)->
        shorten1 = shorten
        url1.shortenify()
      .then (shorten2)->
          expect(shorten1.length).to.equal 5
          expect(shorten2.length).to.equal 5
          expect(shorten1).to.equal shorten2
          done()
          return

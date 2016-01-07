mocha = require 'mocha'
expect = require('chai').expect
sinon = require 'sinon'
mongoose = require 'mongoose'
db = mongoose.createConnection()
User = require '../models/User'

describe 'User', ->

  cleanUserCollection = ->
    db.collections.users.drop()

  before ->
    db.open('mongodb://localhost:27017/pitly')
    User = db.model 'User', User.schema

  populateDatabase = ->
    user1 = new User name: "John", surname: "Doe", mail: 'john.doe@example.com', password: '123456'
    user2 = new User name: "user", surname: "two", mail: "user.two@example.com", password: 'zerty'

    user1.save().then ->
      user2.save()

  after ->
    cleanUserCollection()

  describe '#findAll', ->
    it 'should return a list of users', (done)->
      populateDatabase().then (user2)->


        expect(user2).to.have.property '_id'
        expect(user2).to.have.property 'name', 'user'
        expect(user2).to.have.property 'surname', 'two'
        expect(user2).to.have.property 'mail', 'user.two@example.com'
        expect(user2).to.have.property 'password'

        done()
        return
      return

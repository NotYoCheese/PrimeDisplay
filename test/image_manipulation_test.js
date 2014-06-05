'use strict'
var request = require('supertest');
var chai = require('chai');
var should = chai.should();
var app = require('../app.js');
var User = require('../models/User');
var UserSession = require('./user_session.js');

var mySession = undefined;
var testUser = undefined;

describe('Aviary Save Image', function() {
  var testUserCredentials = {
      email: 'test@gmail.com',
      password: 'password'
    };
  var sessionCookie = undefined;
  var csrftoken = undefined;
  var testUserID = undefined;
  before(function(done) {
    mySession = new UserSession();
    mySession.createLoggedInUser(function(err, result) {
      if (err) return done(err);
      testUser = result;
      done();
    })
});

  after(function(done) {
    User.remove({email: 'test@gmail.com'}, function(err) {
      if (err) return done(err);
      done();
    });
  });

  it('should return a can\'t connect error', function(done){
    var params = {
      _csrf: mySession.csrfToken(),
      urlToReplace: 'oldURL',
      editedUrl: 'newURL',
      user: testUser._id
    };
  	mySession.session()
  	  .post('/api/aviary')
  	  .set('Content-Type', 'application/json')
      .send(params)
      .expect(200)
      .end(function(err, res) {
      	should.not.exist(err);
      	done();
      });
  });
});
'use strict';
var request = require('supertest');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var mongoose = require('mongoose');
//var Browser = require('zombie');
//var browser = new Browser({ site: 'http://localhost:3000' });

var UserSession = require('./user_session.js');
var app = require('../app.js');
var User = require('../models/User');
var ImageStat = require('../models/image-stat.js');


/* NOTE: ImageStat requires a user ID and domain. Since the test cleans up after
  itself these can be anything.
*/

var mySession = undefined;

describe('Requires user to be logged in', function() {
  var tempUser = undefined;
  before(function(done) {
    mySession = new UserSession();
    mySession.createLoggedInUser(function(err, result) {
      if (err) return done(err);
      tempUser = result;
      done();
    })

  });

  after(function(done) {
    mySession.cleanup(done);
  });

  it('should work for a logged in user', function(done) {
    mySession.session()
      .get('/image-stat')
      .expect(200)
      .end(function(err, res, body) {
        should.not.exist(err);
        done();
      });
  });

  it('should recirect if user is not logged in', function(done) {
    request(app)
      .get('/image-stat')
      .expect(302)
      .expect('location', '/login')
      .end(function(err, res, body) {
        should.not.exist(err);
        done();
      });
  });

});

describe('Image record API', function() {

  var tempUser = undefined;

  var wid = Math.floor(Math.random()*1000);
  var hei = Math.floor(Math.random()*1000);
  var rand_url = 'http://fpoimg.com/' + wid + 'x' + hei;
//  var tempImageRecord = {'user': _pd_user, 'user_domain': _pd_user_domain, 'raw_url': rand_url}

  var imageData = undefined;

  before(function(done) {
    mySession = new UserSession();
    mySession.createLoggedInUser(function(err, result) {
      if (err) return done(err);
      tempUser = result;
      imageData = {
        all_urls: [rand_url],
        _pdAccount: tempUser._id,
        _pdDomain: 'thatswhatshesaid.com',
        _csrf: mySession.csrfToken()
      };
      done();
    })
  });

  after(function(done) {
    mySession.cleanup(done);
  });

  it('Search for nonexistent record finds none', function(done){
    ImageStat.find(imageData, function(err, docs)  {
        if (err) return done(err);
        docs.length.should.equal(0, 'Record found; found: ' + docs.length);
        done();
    });
  });

	it('add image record with single url', function(done) 	{
    mySession.session()
      .post('/image-stat/add')
      .send(imageData)
      .expect(200)
      .end(function(err, res, body){
        if (err) return done(err);
        expect(res.body).to.include.keys('result');
        res.body.result.impressions.should.equal(1);
        res.body.isNew.should.equal(true);
        done();
      });
	});

  it('should find existing image record', function(done){
    ImageStat.find({user: tempUser._id}, function(err, docs) {
      if (err) return done(err);
      docs.length.should.equal(1, 'One record not found; found: ' + docs.length);
      done();
    });
  });

  it('delte existing image record', function(done){
    ImageStat.findOne({user: tempUser._id}, function(err, docs) {
      if (err) return done(err);
      docs.remove();
      done();
    });
  });

});

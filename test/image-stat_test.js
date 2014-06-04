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

var wid = Math.floor(Math.random()*1000);
var hei = Math.floor(Math.random()*1000);

var _pd_user = '533dc0d084808bee0a250747';
var _pd_user_domain = 'thatswhatshesaid.com';
var rand_url = 'http://fpoimg.com/' + wid + 'x' + hei;
var tempImageRecord = {'user': _pd_user, 'user_domain': _pd_user_domain, 'raw_url': rand_url}
var mySession = undefined;

describe('Requires user to be logged in', function() {
  before(function(done) {
    mySession = new UserSession();
    mySession.createLoggedInUser(function(err, result) {
      if (err) return done(err);
      //tempImageRecord.user = result._id;
      done();
    })

  });

  after(function(done) {
    User.remove({email: 'test@gmail.com'}, function(err) {
      if (err) return done(err);
      done();
    });
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

describe('Find no temp image record', function(){
  it('and find none', function(done){
    ImageStat.find(tempImageRecord, function(err, docs)  {
        docs.length.should.equal(0, 'Record found; found: ' + docs.length);
        done();
    });
  });
});

describe('Add one image stat record' + rand_url, function() {
	it('use form to add served', function(done) 	{
    var imageData = {
      raw_url: rand_url,
      _pdAccount: _pd_user,
      _pdDomain: _pd_user_domain,
      _csrf: mySession.csrfToken()
    }
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
});

describe('Find one image record', function(){
  it('Should find one...', function(done){
    ImageStat.find(tempImageRecord, function(err, docs) {
      docs.length.should.equal(1, 'One record not found; found: ' + docs.length);
      done();
    });
  });
});

describe('Remove one temp image record', function(){
  it('remove it...', function(done){
    ImageStat.findOne(tempImageRecord, function(err, docs) {
      docs.remove();
      done();
    });
  });
});

describe('Find no temp image record', function(){
  it('and find none', function(done){
      ImageStat.find(tempImageRecord, function(err, docs) {
        docs.length.should.equal(0, 'Record found; found: ' + docs.length);
        done();
      });
  });
});

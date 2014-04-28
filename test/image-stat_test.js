var chai = require('chai');
var should = chai.should();
var app = require('../app.js');
var Browser = require('zombie');
var browser = new Browser({ site: 'http://localhost:3000' });

var mongoose = require('mongoose');
var ImageStat = require('../models/image-stat.js');


/* NOTE: ImageStat requires a user ID and domain. Since the test cleans up after itself these can be anything.
	Though this tests use the maholt@nla.com account.
*/
var _pd_user = '533dc0d084808bee0a250747';
var _pd_user_domain = 'thatswhatshesaid.com';

var wid = Math.floor(Math.random()*1000);
var hei = Math.floor(Math.random()*1000);
var rand_url = 'http://fpoimg.com/' + wid + 'x' + hei;


console.log(rand_url);

describe('Find no temp image record', function(){
  it('and find none', function(done){
        ImageStat.find({'user': _pd_user, 'user_domain': _pd_user_domain, 'raw_url': rand_url}, function(err, docs)
                {
                        docs.length.should.equal(0, 'Record found; found: ' + docs.length);
                        done();
                });
  });
});

describe('GET|GET|POST' + rand_url, function()
{
	it('use form to add served', function(done)
	{
		browser.visit('/image-stat/served', function()
		{
			browser
			.fill('raw_url', rand_url)
			.fill('_pdAccount', _pd_user)
			.fill('_pdDomain', _pd_user_domain)
			.pressButton('served', function()
			{
				browser.success.should.be.true;

				var j = JSON.parse(browser.body._childNodes[0].__nodeValue);

				should.exist(j.result);
				j.result.impressions.should.equal(1);

				should.exist(j.isNew);
				j.isNew.should.equal(true);

				done();
			});
		});
	});
});

describe('Find one image record', function(){
  it('Should find one...', function(done){
        ImageStat.find({'user': _pd_user, 'user_domain': _pd_user_domain, 'raw_url': rand_url}, function(err, docs)
                {
                        docs.length.should.equal(1, 'One record not found; found: ' + docs.length);
                        done();
                });
  });
});
describe('Remove one temp image record', function(){
  it('remove it...', function(done){
        ImageStat.findOne({'user': _pd_user, 'user_domain': _pd_user_domain, 'raw_url': rand_url}, function(err, docs)
                {
                        docs.remove();
                        done();
                });
  });
});
describe('Find no temp image record', function(){
  it('and find none', function(done){
        ImageStat.find({'user': _pd_user, 'user_domain': _pd_user_domain, 'raw_url': rand_url}, function(err, docs)
                {
                        docs.length.should.equal(0, 'Record found; found: ' + docs.length);
                        done();
                });
  });
});

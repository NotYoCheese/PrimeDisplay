var chai = require('chai');
var should = chai.should();
var app = require('../app.js');
var Browser = require('zombie');
var browser = new Browser({ site: 'http://localhost:3000' });

var mongoose = require('mongoose');
var ImageStat = require('../models/image-stat.js');


var rand_image_name = 'zxcvzxcv_' + Math.floor(Math.random()*1000000) + '.jpeg';
var rand_url = '/image-stat/primedisplay_unittest/' + rand_image_name;

console.log(rand_url);

describe('GET|GET|POST' + rand_url, function()
{
	it('should find nothing', function(done)
	{
		browser.visit(rand_url, function()
		{
			browser.success.should.be.true;
			should.not.exist(browser.query('result'));
			var j = JSON.parse(browser.body._childNodes[0].__nodeValue);

			should.exist(j.result);
			should.not.exist(j.result.impressions);
			done();
		});
	});
	it('use form to add served', function(done)
	{
		browser.visit('/image-stat/served', function()
		{
			browser.fill('raw_url', rand_url)
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
        ImageStat.find({'raw_url': rand_url}, function(err, docs)
                {
                        docs.length.should.equal(1, 'One record not found; found: ' + docs.length);
                        done();
                });
  });
});
describe('Remove one temp image record', function(){
  it('remove it...', function(done){
        ImageStat.findOne({'raw_url': rand_url}, function(err, docs)
                {
                        docs.remove();
                        done();
                });
  });
});
describe('Find no temp image record', function(){
  it('and find none', function(done){
        ImageStat.find({'raw_url': rand_url}, function(err, docs)
                {
                        docs.length.should.equal(0, 'Record found; found: ' + docs.length);
                        done();
                });
  });
});


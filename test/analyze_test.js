var chai = require('chai');
var should = chai.should();
var request = require('supertest');
var app = require('../app.js');
var Browser = require('zombie');

describe('GET /analyze', function() {

    it('should return 200 OK', function(done) {
        request(app).get('/analyze').expect(200, done);
    });

    it('should allow entry of a URL', function(done) {
        var browser = new Browser({
            site : 'http://localhost:3000'
        });
        browser.visit('/analyze', function() {
            browser.fill('site', 'http://google.com').pressButton('Analyze', function() {
                browser.success.should.be["true"];
                should.not.exist(browser.query('.alert-danger'));
                done();
            });
        });
    });

    it('should not allow blank URL', function(done) {
        var browser = new Browser({
            site : 'http://localhost:3000'
        });
        browser.visit('/analyze', function() {
            browser.pressButton('Analyze', function() {
                browser.success.should.be["true"];
                should.exist(browser.query('.alert-danger'));
                done();
            });
        });
    });

    it('should allow a URL without a protodol', function(done) {
        var browser = new Browser({
            site : 'http://localhost:3000'
        });
        browser.visit('/analyze', function() {
            browser.fill('site', 'http://google.com').pressButton('Analyze', function() {
                browser.success.should.be["true"];
                should.not.exist(browser.query('.alert-danger'));
                done();
            });
        });
    });

});
var chai = require('chai');
var should = chai.should();
var app = require('../app.js');
var Browser = require('zombie');
var browser = new Browser({
    site : 'http://localhost:3000'
});

describe('GET /about', function() {

    it('should return 200 OK', function(done) {
        request(app).get('/').expect(200, done);
    });
});

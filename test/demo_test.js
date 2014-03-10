var request = require('supertest');
var app = require('../app.js');

describe('GET /demo', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/demo')
      .expect(200, done);
  });
  it('should accept a parameter', function(done) {
    request(app)
      .get('/demo/blur')
      .expect(200, done);
  });
});
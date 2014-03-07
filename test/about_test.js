var request = require('supertest');
var app = require('../app.js');

describe('GET /about', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/about')
      .expect(200, done);
  });
});
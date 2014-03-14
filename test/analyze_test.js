var request = require('supertest');
var app = require('../app.js');

describe('GET /analyze', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/analyze')
      .expect(200, done);
  });
});


module.exports = function() {
  var request = require('supertest');
  var User = require('../models/User');
  var app = require('../app.js');
  var mySession = undefined;
  var csrfToken = undefined;

  var testUserCredentials = {
    email: 'test@gmail.com',
    password: 'password'
  };
  
  var createLoggedInUser = function(callback) {
    var user = new User(testUserCredentials);
    mySession = request.agent(app);
    user.save(function(err, dbUserRecord) {
      if (err) {
        User.remove({email: testUserCredentials.email}, function(err) {
          if (err) return callback(err, undefined);
        });
        return callback(err, undefined);
      }
      mySession
        .get('/login')
        .expect(200)
        .end(function(err, res, body) {
        if (err) {
          User.remove({email: testUserCredentials.email}, function(err) {
            if (err) return callback(err, undefined);
          });
          return callback(err, undefined);
        }
        csrfToken =  unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);
        testUserCredentials._csrf = csrfToken;

        mySession
          .post('/login')
          .send(testUserCredentials)
          .expect(302)
          .end(function(err, res, body) {
            if (err) {
              User.remove({email: testUserCredentials.email}, function(err) {
                if (err) return callback(err, undefined);
              });             
              return callback(err, undefined);
            }
            return callback(undefined, dbUserRecord);
          });
        });
    });
  };

  var cleanup = function(callback) {
    User.remove({email: testUserCredentials.email}, function(err) {
      if (err) return callback(err);
      callback();
    });
  };

  var getSession = function () { return mySession;};
  var getCsrfToken = function () { return csrfToken;};

  return {
    session: getSession,
    csrfToken: getCsrfToken,
    createLoggedInUser: createLoggedInUser,
    cleanup: cleanup
  };
};


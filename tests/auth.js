/**
 * Authentication test
 */
var should = require('should');
var utils = require('./utils').utils;

describe('Authentication', function() {
  var pin = utils.genRandomString(4);
  var keyword = utils.genRandomString(6);
  var password = utils.genRandomString(6);
  describe('Register', function() {
    it('Should register successfully', function(done) {
      utils.register(pin, keyword, password, function(err) {
        should(err).be.null;
        done();
      });
    });
  });

  describe('Login', function() {
    it('Should login successfully', function(done) {
      utils.login(pin, keyword, password, function(err) {
        should(err).be.null;
        done();
      });
    });
  });
});

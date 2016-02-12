/**
 * Application authirisation test
 */
var should = require('should');
var utils = require('./utils').utils;
describe('Authorisation', function() {
  var asycKeys = null;

  before(function() {
    asycKeys = utils.genAsycKeys();
    asycKeys.publicKey = utils.byteToBuffer(asycKeys.publicKey);
    asycKeys.nonce = utils.byteToBuffer(asycKeys.nonce);
    utils.startServer();
  });

  after(function() {
    // utils.msl.startStop();
    // utils.msl = null;
    // utils.restServer = null;
  });

  describe('Authorise', function() {
    it('Should be able to authorize successfully', function(done) {
      utils.msl.onAuthRequest(function(data) {
        utils.msl.authResponse(data, true);
      });
      utils.authorise(asycKeys.publicKey, asycKeys.nonce, function(err, res, body) {
        should(err).be.null;
        should(res.statusCode).be.eql(200);
        utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
        done();
      });
    });
    it('Should throw 401 unauthorised', function(done) {
      utils.msl.onAuthRequest(function(data) {
        utils.msl.authResponse(data, false);
      });
      utils.authorise(asycKeys.publicKey, asycKeys.nonce, function(err, res, body) {
        should(err).be.null;
        should(res.statusCode).be.eql(401);
        utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
        done();
      });
    });
  });


  describe('Revoke', function() {
    it('Should be able to revoke successfully', function(done) {
      utils.msl.onAuthRequest(function(data) {
        utils.msl.authResponse(data, true);
      });
      var authCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
        utils.revoke(body.token, function(err, res, body) {
          should(err).be.null;
          should(res.statusCode).be.eql(200);
          utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
          done();
        });
      };
      utils.authorise(asycKeys.publicKey, asycKeys.nonce, authCallback);
    });
    it('Should throw 400 Session not found', function(done) {
      utils.msl.onAuthRequest(function(data) {
        utils.msl.authResponse(data, true);
      });
      var authCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
        utils.revoke(utils.genRandomString(10), function(err, res, body) {
          should(err).not.be.null;
          should(res.statusCode).be.eql(401);
          utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
          done();
        });
      };
      utils.authorise(asycKeys.publicKey, asycKeys.nonce, authCallback);
    });
    // console.log(utils);
  });
});

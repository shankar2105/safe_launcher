var should = require('should');
var utils = require('./utils').utils;
var request = require('request');

describe('NFS Directory', function() {
  var asycKeys = null;
  var token = null;
  var secretKeys = null;
  var server = 'http://localhost:3000/v1/';
  var masterData = {
    dirPath: '/safe_home',
    isPrivate: false,
    userMetadata: '',
    isVersioned: false,
    isPathShared: false
  };

  before(function(done) {
    asycKeys = utils.genAsycKeys();
    var publicKey = utils.byteToBuffer(asycKeys.publicKey);
    var nonce = utils.byteToBuffer(asycKeys.nonce);
    // utils.startServer();
    utils.msl.onAuthRequest(function(data) {
      utils.msl.authResponse(data, true);
    });
    utils.authorise(publicKey, nonce, function(err, res, body) {
      if (err) {
         throw err
      }
      utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
      token = body.token;
      var encryptedKey = utils.stringToBytes(body.encryptedKey);
      var publicKey = utils.stringToBytes(body.publicKey);
      secretKeys = utils.prepareSymKeys(encryptedKey, publicKey, asycKeys.nonce, asycKeys.privateKey);
      done();
    });
  });

  after(function() {
    // utils.msl.startStop();
    // utils.msl = null;
    // utils.restServer = null;
  });

  describe('Create directory', function() {
    it('Should be able to create new directory', function(done) {
      var data = masterData;
      data = JSON.stringify(data);
      var enc = utils.encryptSec(data, secretKeys.symNonce, secretKeys.symKey);
      var encStr = utils.byteToBuffer(enc);
      var onResponse = function(err, res, body) {
        if (err) {
          return console.log(err);
        }
        should(err).be.null;
        should(res.statusCode).be.eql(202);
        done();
      };
      utils.createDirectory(token, encStr, onResponse);
    });
    it('Should throw 400 - dirPath missing', function(done) {
      var data = masterData;
      data.dirPath = "";
      data = JSON.stringify(data);
      var enc = utils.encryptSec(data, secretKeys.symNonce, secretKeys.symKey);
      var encStr = utils.byteToBuffer(enc);
      var onResponse = function(err, res, body) {
        if (err) {
          return console.log(err);
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(400);
        done();
      };
      utils.createDirectory(token, encStr, onResponse);
    });
    it('Should throw 400 - isVersioned should be boolean', function(done) {
      var data = masterData;
      data.isVersioned = "true";
      data = JSON.stringify(data);
      var enc = utils.encryptSec(data, secretKeys.symNonce, secretKeys.symKey);
      var encStr = utils.byteToBuffer(enc);
      var onResponse = function(err, res, body) {
        if (err) {
          return console.log(err);
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(400);
        done();
      };
      utils.createDirectory(token, encStr, onResponse);
    });
  });
});

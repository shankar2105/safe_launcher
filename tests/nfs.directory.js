var should = require('should');
var utils = require('./utils').utils;

describe('NFS Directory', function() {
  var asycKeys = null;
  var token = null;
  var secretKeys = null;
  var server = 'http://localhost:3000/v1/';
  var dirPath = '/safe_home';

  before(function(done) {
    var pin = utils.genRandomString(4);
    var keyword = utils.genRandomString(6);
    var password = utils.genRandomString(6);
    asycKeys = utils.genAsycKeys();
    var publicKey = utils.byteToBuffer(asycKeys.publicKey);
    var nonce = utils.byteToBuffer(asycKeys.nonce);
    utils.msl.onAuthRequest(function(data) {
      utils.msl.authResponse(data, true);
    });
    var authoriseCallaback = function(err, res, body) {
      if (err) {
         throw err
      }
      utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
      token = body.token;
      var encryptedKey = utils.stringToBytes(body.encryptedKey);
      var publicKey = utils.stringToBytes(body.publicKey);
      secretKeys = utils.prepareSymKeys(encryptedKey, publicKey, asycKeys.nonce, asycKeys.privateKey);
      done();
    };
    var loginCallback = function(err) {
      if (err) {
        throw err;
        return;
      }
      utils.authorise(publicKey, nonce, authoriseCallaback);
    };
    var regCallback = function(err) {
      if (err) {
        throw err;
        return;
      }
      utils.login(pin, keyword, password, loginCallback);
    };
    utils.register(pin, keyword, password, regCallback);
  });

  afterEach(function(done) {
    var urlDirPath = encodeURIComponent(dirPath);
    utils.deleteDir(urlDirPath, false, token, function(err, res, body) {
      if (err) {
        // throw err;
      }
      done();
    })
  });

  var prepareData = function(path, isVersioned) {
    isVersioned = isVersioned || false;
    var data = {
      dirPath: path,
      isPrivate: false,
      userMetadata: '',
      isVersioned: isVersioned,
      isPathShared: false
    };
    data = JSON.stringify(data);
    var enc = utils.encryptSec(data, secretKeys.symNonce, secretKeys.symKey);
    var encStr = utils.byteToBuffer(enc);
    return encStr;
  };

  var prepareUpdateData = function(name, metadata) {
    var data = {};
    if (name) {
      data.name = name;
    }
    if (metadata) {
      data.metadata = metadata;
    }
    data = JSON.stringify(data);
    var enc = utils.encryptSec(data, secretKeys.symNonce, secretKeys.symKey);
    var encStr = utils.byteToBuffer(enc);
    return encStr;
  };

  describe('Create directory', function() {
    it('Should be able to create new directory', function(done) {
      var encStr = prepareData(dirPath);
      var onResponse = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).be.null;
        should(res.statusCode).be.eql(202);
        done();
      };
      utils.createDir(token, encStr, onResponse);
    });
    it('Should throw 400 - dirPath missing', function(done) {
      var encStr = prepareData("");
      var onResponse = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(400);
        done();
      };
      utils.createDir(token, encStr, onResponse);
    });
    it('Should throw 400 - isVersioned should be boolean', function(done) {
      var encStr = prepareData(dirPath, "true");
      var onResponse = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(400);
        done();
      };
      utils.createDir(token, encStr, onResponse);
    });
  });

  describe('Get directory', function() {
    it('Should be able to get directory', function(done) {
      var encStr = prepareData(dirPath);
      var urlEncodedDirPath = encodeURIComponent(dirPath);
      var createDirCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var onResponse = function(err, res, body) {
          if (err) {
            throw err;
            return;
          }
          should(err).be.null;
          should(res.statusCode).be.eql(200);
          done();
        };
        utils.getDir(urlEncodedDirPath, false, token, onResponse);
      };
      utils.createDir(token, encStr, createDirCallback);
    });
    it('Should throw 400 - isPathShared params invalid', function(done) {
      var encStr = prepareData(dirPath);
      var urlEncodedDirPath = encodeURIComponent(dirPath);
      var createDirCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var onResponse = function(err, res, body) {
          if (err) {
            throw err;
            return;
          }
          should(err).not.be.null;
          should(res.statusCode).be.eql(400);
          done();
        };
        utils.getDir(urlEncodedDirPath, "isPathShared", token, onResponse);
      };
      utils.createDir(token, encStr, createDirCallback);
    });
  });

  describe('Update Directory', function() {
    it('Should be able to update directory', function(done) {
      var encStr = prepareData(dirPath);
      var urlDirPath = encodeURIComponent(dirPath);
      var createDirCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var onResponse = function(err, res, body) {
          if (err) {
            throw err;
            return;
          }
          should(err).be.null;
          should(res.statusCode).be.eql(202);
          done();
        };
        var data = prepareUpdateData('/safe_pictures');
        utils.updateDir(urlDirPath, false, data, token, onResponse);
      };
      utils.createDir(token, encStr, createDirCallback);
    });
    it('Should throw 400 error - Invalid request', function(done) {
      var encStr = prepareData(dirPath);
      var urlEncodedDirPath = encodeURIComponent(dirPath);
      var createDirCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var onResponse = function(err, res, body) {
          if (err) {
            throw err;
            return;
          }
          should(err).not.be.null;
          should(res.statusCode).be.eql(400);
          done();
        };
        var data = prepareUpdateData();
        utils.updateDir(urlEncodedDirPath, false, data, token, onResponse);
      };
      utils.createDir(token, encStr, createDirCallback);
    });
  });

  describe('Delete Directory', function() {
    it('Should be able to delete directory', function(done) {
      var encStr = prepareData(dirPath);
      var urlEncodedDirPath = encodeURIComponent(dirPath);
      var createDirCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var onResponse = function(err, res, body) {
          if (err) {
            throw err;
            return;
          }
          should(err).be.null;
          should(res.statusCode).be.eql(202);
          done();
        };
        utils.deleteDir(urlEncodedDirPath, false, token, onResponse);
      };
      utils.createDir(token, encStr, createDirCallback);
    });
    it('Should throw 400 - isPathShared params invalid', function(done) {
      var encStr = prepareData(dirPath);
      var urlEncodedDirPath = encodeURIComponent(dirPath);
      var createDirCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var onResponse = function(err, res, body) {
          if (err) {
            throw err;
            return;
          }
          should(err).not.be.null;
          should(res.statusCode).be.eql(400);
          done();
        };
        utils.deleteDir(urlEncodedDirPath, "isPathShared", token, onResponse);
      };
      utils.createDir(token, encStr, createDirCallback);
    });
  });
});

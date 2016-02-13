var should = require('should');
var utils = require('./utils').utils;

describe('NFS File', function() {
  var asycKeys = null;
  var token = null;
  var secretKeys = null;
  var server = 'http://localhost:3000/v1/';
  var dirPath = '/safe_home';
  var filePath = dirPath + '/index.html';
  var prepareDirData = function(path, isVersioned) {
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

  var prepareData = function(path, isPathShared, metadata) {
    path = path || "";
    isPathShared = isPathShared || false;
    metadata = metadata || "";
    var data = {
      "filePath": path,
      "isPathShared": isPathShared,
      "metadata": metadata
    };
    data = JSON.stringify(data);
    var enc = utils.encryptSec(data, secretKeys.symNonce, secretKeys.symKey);
    var encStr = utils.byteToBuffer(enc);
    return encStr;
  };

  var prepareModifyData = function(path, metadata) {
    var data = {};
    if (path) {
      data.path = path;
    }
    if (metadata) {
      data.metadata = metadata;
    }
    data = JSON.stringify(data);
    var enc = utils.encryptSec(data, secretKeys.symNonce, secretKeys.symKey);
    var encStr = utils.byteToBuffer(enc);
    return encStr;
  };
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
    var onResponse = function(err, res, body) {
      if (err) {
        throw err;
        return;
      }
      done();
    };
    var authoriseCallback = function(err, res, body) {
      if (err) {
         throw err
      }
      utils.restServer.removeAllEventListener(utils.restServer.EVENT_TYPE.AUTH_REQUEST);
      token = body.token;
      var encryptedKey = utils.stringToBytes(body.encryptedKey);
      var publicKey = utils.stringToBytes(body.publicKey);
      secretKeys = utils.prepareSymKeys(encryptedKey, publicKey, asycKeys.nonce, asycKeys.privateKey);
      var encStr = prepareDirData(dirPath);
      utils.createDir(token, encStr, onResponse);
    };
    var loginCallback = function(err) {
      if (err) {
        throw err;
        return;
      }
      utils.authorise(publicKey, nonce, authoriseCallback);
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

  after(function(done) {
    utils.deleteDir(dirPath, token, function(err) {
      if (err) {
        throw err;
      }
      done();
    })
  });

  afterEach(function(done) {
    var urlFilePath = encodeURIComponent(filePath);
    utils.deleteFile(urlFilePath, false, token, function(err) {
      if (err) {
        throw err;
        return;
      }
      done();
    })
  });

  describe('Create file', function() {
    it('Should throw 401 - Unauthorised', function(done) {
      var onResponse = function(err, res, body) {
        if (err) {
          throw err;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(401);
        done();
      };
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      utils.createFile(data, utils.genRandomString(10), onResponse);
    });

    it('Should throw 400 - Invalid File name', function(done) {
      var onResponse = function(err, res, body) {
        if (err) {
          throw err;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(400);
        done();
      };
      var data = prepareData();
      utils.createFile(data, token, onResponse);
    });

    it('Should be able to create a file', function(done) {
      var onResponse = function(err, res, body) {
        if (err) {
          throw err;
        }
        should(err).be.null;
        should(res.statusCode).be.eql(202);
        done();
      };
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      utils.createFile(data, token, onResponse);
    });
  });

  describe('Get file', function() {
    it('Should throw 401 - Unauthorised', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var getFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).be.null;
        should(res.statusCode).be.eql(200);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        utils.getFile(urlFilePath, false, utils.genRandomString(10), getFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
    it('Should be able to get file', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var getFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).be.null;
        should(res.statusCode).be.eql(200);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        utils.getFile(urlFilePath, false, token, getFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
  });

  describe('Update file meta', function() {
    it('Should throw 400 - Invalid data', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var getFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(400);
        done();
      };

      var modifyFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var modifyData = prepareModifyData();
        utils.modifyFileMeta(urlFilePath, false, modifyData, utils.genRandomString(10), modifyFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
    it('Should throw 401 - Unauthorised', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var modifyFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(401);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var modifyData = prepareModifyData(encodeURIComponent('home.js'));
        utils.modifyFileMeta(urlFilePath, false, modifyData, utils.genRandomString(10), modifyFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
    it('Should be able to modify file metadata', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var modifyFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).be.null;
        should(res.statusCode).be.eql(200);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var modifyData = prepareModifyData(encodeURIComponent('home.js'));
        utils.modifyFileMeta(urlFilePath, false, modifyData, token, modifyFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
  });

  describe('Update file content', function() {
    it('Should throw 400 - Invalid data', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var getFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(400);
        done();
      };

      var modifyFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var modifyData = prepareModifyData();
        utils.modifyFile(urlFilePath, false, modifyData, utils.genRandomString(10), modifyFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
    it('Should throw 401 - Unauthorised', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var modifyFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(401);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var modifyData = prepareModifyData(encodeURIComponent('home.js'));
        utils.modifyFile(urlFilePath, false, modifyData, utils.genRandomString(10), modifyFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
    it('Should be able to modify file content', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var modifyFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).be.null;
        should(res.statusCode).be.eql(200);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        var modifyData = prepareModifyData(encodeURIComponent('home.js'));
        utils.modifyFile(urlFilePath, false, modifyData, token, modifyFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
  });

  describe('Delete file', function() {
    it('Should throw 401 - Unauthorised', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var deleteFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).not.be.null;
        should(res.statusCode).be.eql(401);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        utils.modifyFile(urlFilePath, false, utils.genRandomString(10), deleteFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
    it('Should be able to delete a file', function(done) {
      var urlFilePath = encodeURIComponent(filePath);
      var data = prepareData(urlFilePath);
      var deleteFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        should(err).be.null;
        should(res.statusCode).be.eql(200);
        done();
      };

      var createFileCallback = function(err, res, body) {
        if (err) {
          throw err;
          return;
        }
        utils.deleteFile(urlFilePath, false, token, deleteFileCallback);
      };
      utils.createFile(data, token, createFileCallback);
    });
  });
});

var sodium = require('../app/node_modules/libsodium-wrappers');
var request = require('request');
import { remote } from 'electron';
import * as api from '../app/api/safe';
import RESTServer from '../app/server/boot';
import UIUtils from '../app/ui_utils';

var Utils = function() {
  this.msl = null;
  this.restServer = null;
  this.server = 'http://localhost:3000/v1/';
};

// register
Utils.prototype.register = function (pin, keyword, password, callback) {
  api.auth.register(String(pin), keyword, password, callback);
};

Utils.prototype.login = function(pin, keyword, password, callback) {
  api.auth.login(String(pin), keyword, password, callback);
};

Utils.prototype.byteToBuffer = function (bytes) {
  return new Buffer(bytes).toString('base64');
};

Utils.prototype.stringToBytes = function (str) {
  return new Uint8Array(new Buffer(str, 'base64'));
};

Utils.prototype.decrypt = function (cipher, nonce, pubKey, priKey) {
  return sodium.crypto_box_open_easy(cipher, nonce, pubKey, priKey);
};

Utils.prototype.decryptSec = function (secretKey, nonce, pubKey) {
  return sodium.crypto_secretbox_open_easy(secretKey, nonce, pubKey);
};

Utils.prototype.prepareSymKeys = function(secretKey, launcherPubKey, assymNonce, privateKey) {
  var keys = {};
  var cipher = this.decrypt(secretKey, assymNonce, launcherPubKey, privateKey);
  keys.symKey = cipher.slice(0, sodium.crypto_secretbox_KEYBYTES);
  keys.symNonce = cipher.slice(sodium.crypto_secretbox_KEYBYTES);
  return keys;
};

Utils.prototype.encryptSec = function (secretKey, nonce, pubKey) {
  return sodium.crypto_secretbox_easy(secretKey, nonce, pubKey);
};

// start server
Utils.prototype.startServer = function () {
  this.restServer = new RESTServer(api);
  this.msl = new UIUtils(api, this.electronRemote, this.restServer);
  this.msl.startServer();
};

// generate random string
Utils.prototype.genRandomString = function (len) {
  var text = " ";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < len; i++ ) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
};

// generate asyc keys and nonce
Utils.prototype.genAsycKeys = function () {
  var keys = {};
  keys = sodium.crypto_box_keypair();
  keys.nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  return keys;
};

Utils.prototype.authorise = function(publicKey, nonce, callback) {
  var payload = {
    "app": {
      "name": "Mozilla",
      "version": "0.0.1",
      "id": "com.sample",
      "vendor": "DEMO"
    },
    "permissions": [],
    "publicKey": publicKey,
    "nonce": nonce
  };
  var req = {
    url: 'http://localhost:3000/auth',
    json: payload
  };
  request.post(req, callback);
};

Utils.prototype.revoke = function (token, callback) {
  var req = {
    headers: {
      'content-type' : 'application/json',
      'Authorization': 'bearer ' + token
    },
    url: 'http://localhost:3000/auth',
  };
  request.del(req, callback);
};

Utils.prototype.createDir = function (token, encStr, callback) {
  var payload = {
    url: this.server + 'nfs/directory',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    },
    body: encStr
  };
  request(payload, callback);
};

Utils.prototype.getDir = function (urlEncodedDirPath, isPathShared, token, callback) {
  isPathShared = isPathShared || false;
  var payload = {
    url: this.server + 'nfs/directory/' + urlEncodedDirPath + '/' + isPathShared,
    method: 'GET',
    headers: {
      'Authorization': 'bearer ' + token,
      'Content-Type': 'text/plain'
    }
  };
  request(payload, callback);
};

Utils.prototype.deleteDir = function (dirPath, isPathShared, token, callback) {
  isPathShared = isPathShared || false;
  var payload = {
    url: this.server + 'nfs/directory/' + dirPath + '/' + isPathShared,
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    }
  };
  request(payload, callback);
};

Utils.prototype.updateDir = function (dirPath, isPathShared, data, token, callback) {
  var payload = {
    url: this.server + 'nfs/directory/' + dirPath + '/' + isPathShared,
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    },
    body: data
  };
  request(payload, callback);
};

Utils.prototype.createFile = function (data, token, callback) {
  var payload = {
    url: this.server + '/nfs/file',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    },
    body: data
  };
  request(payload, callback);
};

Utils.prototype.getFile = function (filePath, isPathShared, token, callback) {
  isPathShared = isPathShared || false;
  var payload = {
    url: this.server + 'nfs/file/' + filePath + '/' + isPathShared,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    }
  };
  request(payload, callback);
};

Utils.prototype.modifyFileMeta = function (filePath, isPathShared, data, token, callback) {
  var payload = {
    url: this.server + 'nfs/file/metadata/' + filePath + '/' + isPathShared,
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    },
    body: data
  };
  request(payload, callback);
};

Utils.prototype.modifyFile = function (filePath, isPathShared, data, token, callback) {
  var payload = {
    url: this.server + 'nfs/file/' + filePath + '/' + isPathShared,
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    },
    body: data
  };
  request(payload, callback);
};

Utils.prototype.deleteFile = function(filePath, isPathShared, token, callback) {
  isPathShared = isPathShared || false;
  var payload = {
    url: this.server + 'nfs/file/' + filePath + '/' + isPathShared,
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'text/plain'
    }
  };
  request(payload, callback);
};

Utils.prototype.electronRemote = {
  getCurrentWindow: function() {
    return this;
  },
  on: function(type, callback) {
    return;
  }
};

exports.utils = new Utils();

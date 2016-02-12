var sodium = require('../app/node_modules/libsodium-wrappers');
var request = require('request');
import { remote } from 'electron';
import * as api from '../app/api/safe';
import RESTServer from '../app/server/boot';
import UIUtils from '../app/ui_utils';

var Utils = function() {
  this.msl = null;
  this.restServer = null;
};

// register
Utils.prototype.register = function (api, pin, keyword, password, callback) {
  api.auth.register(String(pin), keyword, password, callback);
};

Utils.prototype.byteToBuffer = function (bytes) {
  return new Buffer(bytes).toString('base64');
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

Utils.prototype.login = function(api, pin, keyword, password, callback) {
  api.auth.login(String(pin), keyword, password, callback);
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

var should = require('should');
var utils = require('./utils').utils;
var request = require('request');
import { remote } from 'electron';
import * as api from '../app/api/safe';
import RESTServer from '../app/server/boot';
import UIUtils from '../app/ui_utils';

describe('NFS Directory', function() {
  // var data = {
  //   dirPath: '/safe_home',
  //   isPrivate: false,
  //   userMetadata: '',
  //   isVersioned: false,
  //   isPathShared: false
  // };
  // var serverUrl = 'http://localhost:3000/nfs/directory';
  // var authData = null;
  // var restServer = null;
  // var msl = null;
  before(function(done) {
    // restServer = new RESTServer(api);
    // msl = new UIUtils(api, utils.electronRemote, restServer);
    // msl.startServer();
    // msl.onAuthRequest(function(data) {
    //   msl.authResponse(data, true);
    // });
    // utils.authorize(request, function(err, res, body) {
    //   restServer.removeAllEventListener(restServer.EVENT_TYPE.AUTH_REQUEST);
    //   authData = body;
    //   done();
    // });
  });
  // it('Should be able to create new directory', function(done) {
  //   // var payload = {
  //   //   url: serverUrl,
  //   //
  //   // };
  //   should(true).be.ok();
  // });
});

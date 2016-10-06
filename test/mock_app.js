import {loadLibrary} from '../app/ffi/loader';
import auth from '../app/ffi/api/auth';
import RESTServer from '../app/server/boot';
import axios from 'axios';
import crypto from 'crypto';
import should from 'should';

class MockApp {

  constructor() {
    this.config = require('../config/env_test.json');
    loadLibrary();
    this.server = new RESTServer(this.config.serverPort);
    this.server.start();
    this.axios = axios.create({
      baseURL: 'http://localhost:' + this.config.serverPort + '/'
    });
    this.authorizationToken = null;
  }

  registerAuthorisationListener(callback) {
    this.server.addEventListener(this.server.EVENT_TYPE.AUTH_REQUEST, callback);
  }

  onAppAuthorised(callback) {
    this.server.addEventListener(this.server.EVENT_TYPE.SESSION_CREATED, callback);
  }

  getUnregisteredClient() {
    auth.getUnregisteredSession().should.be.fulfilled();
  }

  registerRandomUser() {
    const locator = crypto.randomBytes(20).toString();
    const secret = crypto.randomBytes(20).toString();
    auth.register(locator, secret).should.be.fulfilled();
  }

  approveAppAuthorisation(app) {
    this.server.authApproved(app);
  }

  rejectAppAuthorisation(app) {
    this.server.authRejected(app);
  }

  get authToken() {
    return this.authorizationToken;
  }

  set authToken(token) {
    this.authorizationToken = token;
  }

}

const mockApp = new MockApp();
export default mockApp;

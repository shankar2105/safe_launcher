import should from 'should';
import crypto from 'crypto';
import structUtils from '../utils/structured_data_utils';
import cipherUtils from '../utils/cipher_utils';
import dataIdUtils from '../utils/data_id_utils';
import authUtils from '../utils/auth_utils';
import { CONSTANTS, MESSAGES } from '../constants';

describe('Structured data', () => {
	let authToken = null;
  const invalidHandleId = 1234;
  before(() => (
    authUtils.registerAndAuthorise(CONSTANTS.AUTH_PAYLOAD_LOW_LEVEL_API)
      .then(token => (authToken = token))
  ));
  after(() => authUtils.revokeApp(authToken));

  describe('Create and read structure data', () => {
    const SD_NAME = crypto.randomBytes(32).toString('base64');
    const SD_CONTENT = new Buffer('test structured data').toString('base64');
    let SD_HANDLEID = null;

    after(() => (
      structUtils.delete(authToken, SD_HANDLEID)
        .then(res => structUtils.dropHandle(authToken, SD_HANDLEID))
    ));

  	it('Should return 401 if authorisation token is not valid on creating', () => (
      structUtils.create(null)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(401);
          should(err.response.data.errorCode).be.equal(400);
        })
    ));

    it('Should return 403 if low Level API Access is not provided on creating', () => {
      let authTokenWithoutAccess = null;
      return authUtils.registerAndAuthorise()
        .then(token => (authTokenWithoutAccess = token))
        .then(() => structUtils.create(authTokenWithoutAccess))
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(403);
          should(err.response.data.errorCode).be.equal(400);
          should(err.response.data.description).be.equal(MESSAGES.LOW_LEVEL_API_ACCESS_NOT_GRANTED);
        })
        .then(() => authUtils.revokeApp(authTokenWithoutAccess));
    });

    it('Should return 400 if \'name\' params is missing on creation', () => (
      structUtils.create(authToken)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(400);
          should(err.response.data.errorCode).be.equal(400);
          should(err.response.data.description.indexOf('name')).be.not.equal(-1);
        })
    ));

    it('Should return 400 if typeTag is not a number on creation', () => (
      structUtils.create(authToken, SD_NAME, 'typeTag')
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(400);
          should(err.response.data.errorCode).be.equal(400);
          should(err.response.data.description.indexOf('Tag type')).be.not.equal(-1);
        })
    ));
    it('Should return 400 if typeTag is not in specific range on creation', () => (
      structUtils.create(authToken, SD_NAME, 14999)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(400);
          should(err.response.data.errorCode).be.equal(400);
          should(err.response.data.description).be.equal('Invalid tag type specified');
        })
    ));

    it('Should return 400 if data is not base64 buffer on creation', () => (
      structUtils.create(authToken, SD_NAME, CONSTANTS.TYPE_TAG.UNVERSIONED, null, 11)
        .should.be.rejectedWith(Error)
        .then(err => should(err.response.status).be.equal(400))
    ));

    it('Should return 400 if cipherOptsHandle is not valid on creation', () => (
      structUtils.create(authToken, SD_NAME, CONSTANTS.TYPE_TAG.UNVERSIONED, 11, 'test string')
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(400)
          should(err.response.data.errorCode).be.equal(-1517)
          should(err.response.data.description).be.equal('FfiError::InvalidCipherOptHandle')
        })
    ));

    it('Should be able to create structure data', () => (
      structUtils.create(authToken, SD_NAME, CONSTANTS.TYPE_TAG.UNVERSIONED, null, SD_CONTENT)
        .should.be.fulfilled()
        .then(res => {
          should(res.status).be.equal(200);
          should(res.data).have.keys('handleId');
          should(res.data.handleId).be.Number();
          SD_HANDLEID = res.data.handleId;
        })
    ));

    it('Should return 401 if authorisation token is not valid on put', () => (
      structUtils.put(null)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(401);
          should(err.response.data.errorCode).be.equal(400);
        })
    ));

    it('Should return 400 if invalid handleId is passed on put', () => (
      structUtils.put(authToken, invalidHandleId)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(400);
          should(err.response.data.errorCode).be.equal(-1513);
          should(err.response.data.description).be.equal('FfiError::InvalidStructDataHandle');
        })
    ));

    it('Should be able to put structured data', () => (
      structUtils.put(authToken, SD_HANDLEID)
        .should.be.fulfilled()
        .then(res => should(res.status).be.equal(200))
    ));

    it('Should return 400 if invalid handleId is passed on read', () => (
      structUtils.read(authToken, invalidHandleId)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(err.response.status).be.equal(400);
          should(err.response.data.errorCode).be.equal(-1513);
          should(err.response.data.description).be.equal('FfiError::InvalidStructDataHandle');
        })
    ));

    it('Should be able to read structure data', () => (
      structUtils.read(authToken, SD_HANDLEID)
        .should.be.fulfilled()
        .then(res => {
          should(res.status).be.equal(200);
          should(res.data).be.equal(new Buffer(SD_CONTENT, 'base64').toString());
        })
    ));
  });
});

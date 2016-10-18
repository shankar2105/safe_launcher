import should from 'should';
import immutUtils from '../utils/immutable_data_utils';
import cipherUtils from '../utils/cipher_utils';
import authUtils from '../utils/auth_utils';
import { CONSTANTS, MESSAGES } from '../constants';

describe('Immutable data', () => {
	let authToken = null;

	before(() => (
		authUtils.registerAndAuthorise(CONSTANTS.AUTH_PAYLOAD_LOW_LEVEL_API)
      .then(token => (authToken = token))
	));
	after(() => authUtils.revokeApp(authToken));

	describe('Get writer handle', () => {
		it('Should return 401 if authorisation token is not valid', () => (
			immutUtils.getWriterHandle()
			.should.be.rejectedWith(Error)
			.then(err => {
				should(err.response.status).be.equal(401);
				should(err.response.data.errorCode).be.equal(400);
			})
		));

		it('Should return 403 if low Level API Access is not provided', () => {
			let authTokenWithoutAccess = null;
			return authUtils.registerAndAuthorise()
				.then(token => (authTokenWithoutAccess = token))
				.then(() => immutUtils.getWriterHandle(authTokenWithoutAccess))
				.should.be.rejectedWith(Error)
				.then(err => {
					should(err.response.status).be.equal(403);
					should(err.response.data.errorCode).be.equal(400);
					should(err.response.data.description).be.equal(MESSAGES.LOW_LEVEL_API_ACCESS_NOT_GRANTED);
				})
				.then(() => authUtils.revokeApp(authTokenWithoutAccess));
		});

		it('Should be able to get immutable data writer handle', () => (
			immutUtils.getWriterHandle(authToken)
				.should.be.fulfilled()
				.then(res => {
					should(res.status).be.equal(200);
					should(res.data).have.keys('handleId');
					should(res.data.handleId).be.Number();
					return res.data.handleId;
				})
				.then(handleId => immutUtils.dropWriter(authToken, handleId))
				.should.be.fulfilled()
		));
	});

	describe('Write immutable data', () => {
		let writerHandleId = null;
		const content = new Buffer('Test sample');

		before(() => (
			immutUtils.getWriterHandle(authToken)
				.then(res => writerHandleId = res.data.handleId)
		));
		after(() => immutUtils.dropWriter(authToken, writerHandleId));

		it('Should return 401 if authorisation token is not valid', () => (
			immutUtils.write(null, writerHandleId)
				.should.be.rejectedWith(Error)
				.then(err => {
					should(err.response.status).be.equal(401);
					should(err.response.data.errorCode).be.equal(400);
				})
		));
		it('Should return 403 if low Level API Access is not provided', () => {
			let authTokenWithoutAccess = null;
			return authUtils.registerAndAuthorise()
				.then(token => (authTokenWithoutAccess = token))
				.then(() => immutUtils.write(authTokenWithoutAccess, writerHandleId))
				.should.be.rejectedWith(Error)
				.then(err => {
					should(err.response.status).be.equal(403);
					should(err.response.data.errorCode).be.equal(400);
					should(err.response.data.description).be.equal(MESSAGES.LOW_LEVEL_API_ACCESS_NOT_GRANTED);
				})
				.then(() => authUtils.revokeApp(authTokenWithoutAccess));
		});
		it('Should return 400 if writer handle is not valid', () => (
			immutUtils.write(authToken, 23, content, { headers: { 'content-type': 'text/plain' } })
				.should.be.rejectedWith(Error)
				.then(err => {
					should(err.response.status).be.equal(400);
					should(err.response.data.errorCode).be.equal(-1516);
					should(err.response.data.description).be.equal('FfiError::InvalidSelfEncryptorHandle');
				})
		));
		it('Should be able to write data', () => (
			immutUtils.write(authToken, writerHandleId, content, { headers: { 'content-type': 'text/plain' } })
				.should.be.fulfilled()
				.then(res => should(res.status).be.equal(200))
		));
	});

	describe('Close writer', () => {
		let writerHandleId = null;
		const content = new Buffer('Test sample');

		before(() => (
			immutUtils.getWriterHandle(authToken)
				.then(res => writerHandleId = res.data.handleId)
				.then(() => immutUtils.write(authToken, writerHandleId, content, { headers: { 'content-type': 'text/plain' } }))
		));
		after(() => immutUtils.dropWriter(authToken, writerHandleId));

		it('Should return 401 if authorisation token is not valid', () => (
			immutUtils.closeWriter(null, writerHandleId)
				.should.be.rejectedWith(Error)
				.then(err => {
					should(err.response.status).be.equal(401);
					should(err.response.data.errorCode).be.equal(400);
				})
		));
		it('Should return 403 if low Level API Access is not provided', () => {
			let authTokenWithoutAccess = null;
			return authUtils.registerAndAuthorise()
				.then(token => (authTokenWithoutAccess = token))
				.then(() => immutUtils.closeWriter(authTokenWithoutAccess, writerHandleId))
				.should.be.rejectedWith(Error)
				.then(err => {
					should(err.response.status).be.equal(403);
					should(err.response.data.errorCode).be.equal(400);
					should(err.response.data.description).be.equal(MESSAGES.LOW_LEVEL_API_ACCESS_NOT_GRANTED);
				})
				.then(() => authUtils.revokeApp(authTokenWithoutAccess));
		});
	});
});

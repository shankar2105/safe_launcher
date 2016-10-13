import should from 'should';
import mockApp from '../mock_app';
import utils from './utils';

const FIELDS_MISSING_MSG = 'Required fields are missing';
const EMPTY_VALUE_MSG = 'Values cannot be empty';
const INVALID_PERMISSION_REQ = 'Invalid permissions requested';
const UNAUTHORISED = 'Unauthorised';

describe('Application authorisation', () => {
  describe('Request parameter validation', () => {
    it('Should return 400 status code on empty payload', () => {
      const payload = {};
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code if app is not available in payload', () => {
      const payload = {
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code if app is empty object in payload', () => {
      const payload = {
        app: {},
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code if app with only app.name in payload', () => {
      const payload = {
        app: {
          name: 'test_app'
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code if app with only app.id in payload', () => {
      const payload = {
        app: {
          id: 'test_app'
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code if app with only app.vendor in payload', () => {
      const payload = {
        app: {
          vendor: 'test_app'
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code if app with only app.version in payload', () => {
      const payload = {
        app: {
          version: '0.1.1'
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code if permission field is missing in payload', () => {
      const payload = {
        app: {
          name: 'test_app',
          id: 'test.app',
          version: '0.1.1',
          vendor: 'MaidSafe'
        }
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should('Permission field is missing').be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code for invalid Content-Type specified', () => {
      const payload = {
        app: {
          name: 'test_app',
          id: 'test.app',
          version: '0.1.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };
      const config = {
        headers: {
          'Content-Type': 'text/plain'
        }
      };
      return mockApp.axios.post('auth', payload, config)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(FIELDS_MISSING_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code for empty name string with space', () => {
      const payload = {
        app: {
          name: ' ',
          id: 'test.app',
          version: '0.1.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(EMPTY_VALUE_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code for empty id string with space', () => {
      const payload = {
        app: {
          name: 'app name',
          id: ' ',
          version: '0.1.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(EMPTY_VALUE_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code for empty version string with space', () => {
      const payload = {
        app: {
          name: 'app name',
          id: 'test_app',
          version: ' ',
          vendor: 'MaidSafe'
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(EMPTY_VALUE_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code for empty vendor string with space', () => {
      const payload = {
        app: {
          name: 'app name',
          id: 'test_app',
          version: '0.0.1',
          vendor: ' '
        },
        permissions: []
      };
      return utils.authoriseApp(payload)
        .should.be.rejected()
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(EMPTY_VALUE_MSG).be.equal(err.response.data.description);
        });
    });

    it('Should return 400 status code for invalid Permission field', () => {
      const payload = {
        app: {
          name: 'app name',
          id: 'test_app',
          version: '0.0.1',
          vendor: 'MaidSafe'
        },
        permissions: ['SAFE_DRIVE_PERMISSION']
      };

      return utils.authoriseApp(payload)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(400).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(INVALID_PERMISSION_REQ).be.equal(err.response.data.description);
        });
    });
  });

  describe('Unauthorised validation', () => {
    it('Should return 401 status code for unauthorised user', () => {
      const payload = {
        app: {
          name: 'app name',
          id: 'test.maidsafe.net',
          version: '0.0.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };

      return utils.authoriseApp(payload, false)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(401).be.equal(err.response.status);
          should(UNAUTHORISED).be.equal(err.response.data);
        });
    });
  });

  describe('Authorise app', () => {
    const authTokens = [];
    before(() => mockApp.registerRandomUser());

    after(() => {
      mockApp.removeSessionCreatedEvent();
      return Promise.all(authTokens.map(token => utils.revokeApp(token)));
    });

    it('Should return 401 status code for rejecting application', () => {
      const payload = {
        app: {
          name: 'app name',
          id: 'test.maidsafe.net',
          version: '0.0.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };

      return utils.authoriseApp(payload, false)
        .should.be.rejectedWith(Error)
        .then(err => {
          should(401).be.equal(err.response.status);
          should(UNAUTHORISED).be.equal(err.response.data);
        });
    });

    it('Should be able to authorise application', (done) => {
      const payload = {
        app: {
          name: 'app name',
          id: 'test.maidsafe.net',
          version: '0.0.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };

      mockApp.onAppAuthorised(() => {
        done();
      });

      utils.authoriseApp(payload, true)
        .should.be.fulfilled()
        .then(res => {
          should(200).be.equal(res.status);
          res.data.should.have.keys('token', 'permissions');
          authTokens.push(res.data.token);
        });
    });
  });

  describe('Revoke app', () => {
    let authToken = null;

    before((done) => {
      const payload = {
        app: {
          name: 'app name 1',
          id: 'test.maidsafe.net1',
          version: '0.0.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };
      mockApp.onAppAuthorised(() => {
        done();
      });

      mockApp.registerRandomUser()
        .then(() => utils.authoriseApp(payload, true))
        .then(res => {
          authToken = res.data.token;
        });
    });

    after(() => {
      mockApp.removeSessionCreatedEvent();
    });

    it('Should return 401 status code if Session ID not found', () => (
      utils.revokeApp()
        .should.be.rejectedWith(Error)
        .then(err => {
          should(401).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(UNAUTHORISED).be.equal(err.response.data.description);
        })
    ));

    it('Should be able to revoke application', () => (
      utils.revokeApp(authToken)
        .should.be.fulfilled()
        .then(res => {
          should(200).be.equal(res.status);
        })
    ));
  });

  describe('Check token valid', () => {
    let authToken = null;

    before((done) => {
      const payload = {
        app: {
          name: 'app name 1',
          id: 'test.maidsafe.net1',
          version: '0.0.1',
          vendor: 'MaidSafe'
        },
        permissions: []
      };
      mockApp.onAppAuthorised(() => {
        done();
      });

      mockApp.registerRandomUser()
        .then(() => utils.authoriseApp(payload, true))
        .then(res => {
          authToken = res.data.token;
        });
    });

    after(() => {
      mockApp.removeSessionCreatedEvent();
    });

    it('Should return 401 status code if Session ID not found', () => (
      mockApp.axios.get('auth')
        .should.be.rejectedWith(Error)
        .then(err => {
          should(401).be.equal(err.response.status);
          should(400).be.equal(err.response.data.errorCode);
          should(UNAUTHORISED).be.equal(err.response.data.description);
        })
    ));

    it('Should be able to validate token', () => (
      mockApp.axios.get('auth', { headers: { Authorization: `Bearer ${authToken}` } })
        .should.be.fulfilled()
        .then(res => {
          should(200).be.equal(res.status);
        })
    ));
  });
});

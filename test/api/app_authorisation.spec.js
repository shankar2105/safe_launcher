'use strict';

import mockApp from '../mock_app';
import should from 'should';

const FIELDS_MISSING_MSG = 'Required fields are missing';
const EMPTY_VALUE_MSG ='Values cannot be empty';

describe('Application authorisation', () => {

  it('Should return 400 status code on empty payload', () => {
    const payload = {};
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
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
    return mockApp.axios.post('auth', payload)
      .should.be.rejected()
      .then(err => {
        should(400).be.equal(err.response.status);
        should(400).be.equal(err.response.data.errorCode);
        should(EMPTY_VALUE_MSG).be.equal(err.response.data.description);
      });
  });

});
import mockApp from '../mock_app';

class Utils {
  authoriseApp(authPayload, authRes) {
    if (typeof authRes !== 'undefined') {
      mockApp.registerAuthorisationListener(payload => {
        authRes ? mockApp.approveAppAuthorisation(payload) :
          mockApp.rejectAppAuthorisation(payload);
        mockApp.removeAuthReqEvent();
      });
    }
    return mockApp.axios.post('auth', authPayload);
  }

  revokeApp(authToken) {
    const option = {};
    if (authToken) {
      option.headers = {
        Authorization: `Bearer ${authToken}`
      };
    }
    return mockApp.axios.delete('auth', option);
  }
}

const utils = new Utils();

export default utils;

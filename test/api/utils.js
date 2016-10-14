import mockApp from '../mock_app';
import { CONSTANTS } from '../constants';

class Utils {
  HTTP_METHOD = {
      POST: 'post',
      GET: 'get',
      PUT: 'put',
      DELETE: 'delete'  
  };

  FILE_OR_DIR_ACTION = {
    COPY: 'copy',
    MOVE: 'move'
  };

  registerRandomUser() {
    return mockApp.registerRandomUser();
  }

  authoriseApp(authPayload, config, authRes) {
    if (typeof authRes !== 'undefined') {
      mockApp.registerAuthorisationListener(payload => {
        authRes ? mockApp.approveAppAuthorisation(payload) :
          mockApp.rejectAppAuthorisation(payload);
        mockApp.removeAuthReqEvent();
      });
    }

    return mockApp.axios.post('auth', authPayload, config);
  }

  revokeApp(authToken) {
    const config = {};
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`
      };
    }

    return mockApp.axios.delete('auth', config);
  }

  registerAndAuthorise(authPayload) {
    let authToken = null;

    return mockApp.registerRandomUser()
      .then(() => this.authoriseApp(authPayload || CONSTANTS.AUTH_PAYLOAD, {}, true))
      .then(res => res.data.token);
  }

  isAuthTokenValid(config) {
    return mockApp.axios.get('auth', config);
  }

  createDir(token, rootPath, path, body, config) {
    return this._nfsDirRequest(this.HTTP_METHOD.POST, token, rootPath, path, body, config);
  }

  getDir(token, rootPath, path, config) {
    return this._nfsDirRequest(this.HTTP_METHOD.GET, token, rootPath, path, config);
  }

  deleteDir(token, rootPath, path, config) {
    return this._nfsDirRequest(this.HTTP_METHOD.DELETE, token, rootPath, path, config, true);
  }

  modifyDir(token, rootPath, path, body, config) {
    return this._nfsDirRequest(this.HTTP_METHOD.PUT, token, rootPath, path, body, config);
  }

  moveOrCopyDir(token, srcRootPath, destRootPath, srcPath, destPath, action, config) {
    const url = 'nfs/movedir';
    let reqConfig = {};
    if (token) {
      if (!reqConfig.headers) {
        reqConfig.headers = {};
      }
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config) {
      reqConfig = Object.assign(reqConfig, config);  
    }
    const body = {
      srcPath,
      destPath,
      srcRootPath,
      destRootPath
    };
    if (action) {
      body.action = action;
    }
    return mockApp.axios.post(url, body, reqConfig);
  }

  _nfsDirRequest(method, ...arg) {
    const authToken = arg[0];
    const rootPath = arg[1];
    const dirPath = arg[2];
    let reqConfig = {};
    let body = null; 
    const url = `${CONSTANTS.API.NFS_DIR}${rootPath || undefined}/${dirPath || ''}`;

    if (authToken) {
      if (!reqConfig.headers) {
        reqConfig.headers = {};
      }
      reqConfig.headers.Authorization = `Bearer ${authToken}`;
    }

    switch(method) {
      case this.HTTP_METHOD.POST: 
        body = arg[3];
        reqConfig = Object.assign(reqConfig, arg[4]);
        return mockApp.axios.post(url, body, reqConfig);
      case this.HTTP_METHOD.GET:
        reqConfig = Object.assign(reqConfig, arg[3]);
        return mockApp.axios.get(url, reqConfig);
      case this.HTTP_METHOD.DELETE:
        reqConfig = Object.assign(reqConfig, arg[3]);
        return mockApp.axios.delete(url, reqConfig);
      case this.HTTP_METHOD.PUT:
        body = arg[3];
        reqConfig = Object.assign(reqConfig, arg[3]);
        return mockApp.axios.put(url, body, reqConfig);
      default:
        throw new Error('Invalid method');
    }
  }
}

const utils = new Utils();

export default utils;

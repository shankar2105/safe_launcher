import { Application } from 'spectron';
import electronPath from 'electron';
import * as utils from './utils';
import * as server from './server.spec';
import * as authorise from './authorise.spec';
import * as nfs from './nfs.spec';

const delay = time => new Promise(resolve => setTimeout(resolve, time));

describe('SAFE Launcher Test', function() {
  this.timeout(15000);

  const checkNetworkConnected = async (done) => {
    const { client } = this.app;
    await client.waitUntilWindowLoaded();
    await delay(1000);
    let networkStatus = await client.getAttribute('#networkStatus', 'class');
    if (networkStatus.indexOf('connected') === -1) {
      return await checkNetworkConnected();
    }
  };

  const login = async () => {
    const { client } = this.app;
    await client.setValue('#accountSecret', utils.CONSTANTS.USER_LOCATION);
    await client.setValue('#accountPassword', utils.CONSTANTS.USER_PASSWORD);
    await client.click('button[name=login]');
  };

  const checkAuthenticated = async () => {
    const { client } = this.app;

    let currentRoute = (await client.getUrl()).split('#')[1].split('?')[0];
    if (currentRoute !== '/account_app_list') {
      return await checkAuthenticated();
    }
    // TODO failed to login
  };

  const authoriseApp = async(status) => {
    const { client } = this.app;
    const authReqEle = (await client.element('.auth-req')).value;
    if (!authReqEle.ELEMENT) {
      return allowApp();
    }
    if (status) {
      return await client.click('button[name=allow]');
    }
    await client.click('button[name=deny]');
  };

  before(async() => {
    this.app = new Application({
      path: electronPath,
      args: ['./test/app'],
    });
    await this.app.start();
    await checkNetworkConnected();
    await login();
    await checkAuthenticated();
  });

  after(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  describe('API Server Utils', () => {
    it('should connect to API server', server.checkHealth);
  });

  describe('Application Authorisation', () => {
    // Authorise application
    it('should authorise application', async() => {
      authoriseApp(true);
      await authorise.authoriseApp();
    });

    it ('should deny authorisation', async() => {
      authoriseApp();
      await authorise.denyAuthorisation();
    });

    it('should be authorised application', authorise.checkAppAuthorised);
  });

  // NFS Directory
  describe('NFS Directory', () => {
    it('should be able to create directory', nfs.createDirTest);
    it('should be able to get directory', nfs.getDirTest);
    // it('should be able to modify directory metadata', nfs.modifyDirTest);
    it('should be able to delete directory', nfs.deleteDirTest);
    it('should be able to move dirctory', nfs.moveDirTest);
    it('should be able to copy dirctory', nfs.copyDirTest);
  });

  describe('NFS File', () => {
    it('should be able to create file', nfs.createFileTest);
    it('should be able to get file', nfs.getFileTest);
    // it('should be able to modify file metadata', nfs.modifyAndGetFileMetaTest);
    it('should be able to delete file', nfs.deleteFileTest);
    it('should be able to move file', nfs.moveFileTest);
    it('should be able to copy file', nfs.copyFileTest);
  });

  // Revoke application
  describe('Revoke Application', () => {
    it('should revoke application', authorise.revokeApp);
  });
});

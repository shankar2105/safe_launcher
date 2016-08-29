import { setNetworkDisconnected, setNetworkConnected, setNetworkConnecting } from './actions/network_status_action';
import { showAuthRequest, addApplication, addActivity, updateActivity } from './actions/app_action';

export default class EventRegistry {
  constructor(store) {
    this.dispatch = store.dispatch;
  }

  handleNetworkEvents() {
    let self = this;

    window.msl.setNetworkStateChangeListener((status) => {
      switch (status) {
        case 0:
          self.dispatch(setNetworkConnecting());
          break;
        case 1:
          self.dispatch(setNetworkConnected());
          break;
        case 2:
          self.dispatch(setNetworkDisconnected());
          break;
        default:
      }
    });
  }

  handleAPIServer() {
    window.msl.startServer();

    window.msl.onServerError((err) => {
      return console.error('API Server Error :: ', err);
    });

    window.msl.onServerStarted(() => {
      return console.log('API Server Started');
    });

    window.msl.onServerShutdown((data) => {
      return console.log('API Server Stopped :: ', data);
    });
  }

  handleProxyServer() {
    window.msl.onProxyStart(() => {
      return console.error('Proxy Server Started');
    });

    window.msl.onProxyError((err) => {
      return console.error('Proxy Server Error :: ', err);
    });

    window.msl.onProxyExit(() => {
      return console.error('Proxy Server Stopped');
    });
  }

  handleAppSession() {
    let self = this;

    window.msl.onSessionCreated((appData) => {
      self.dispatch(addApplication(appData));
    });

    window.msl.onSessionCreationFailed((err) => {
      return console.error('Failed to create App Session :: ', err);
    });

    window.msl.onSessionRemoved((data) => {
      return console.error('Removed App Session :: ', data);
    });
  }

  handleAuthRequest() {
    let self = this;
    window.msl.onAuthRequest((payload) => {
      window.msl.focusWindow();
      self.dispatch(showAuthRequest(payload));
    });
  }

  handleActivityEvents() {
    let self = this;
    window.msl.onNewAppActivity((data) => {
      if (!data) {
        return;
      }
      self.dispatch(addActivity(data));
    });

    window.msl.onUpdatedAppActivity((data) => {
      if (!data) {
        return;
      }
      self.dispatch(updateActivity(data));
    });
  }

  run() {
    this.handleNetworkEvents();
    this.handleAPIServer();
    this.handleProxyServer();
    this.handleAppSession();
    this.handleActivityEvents();
    this.handleAuthRequest();
  }
}

import { setNetworkDisconnected, setNetworkConnected, setNetworkConnecting } from './actions/network_status_action';

export default class EventRegistry {
  constructor(store) {
    this.dispatch = store.dispatch;
  }
  run() {
    let self = this;
    window.msl.startServer();
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
}

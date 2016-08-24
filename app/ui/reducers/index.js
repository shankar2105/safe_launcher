import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import networkStatus from './network_status_reducer';
import proxy from './proxy_reducer';
import auth from './auth_reducer';

const rootReducer = combineReducers({
  networkStatus,
  proxy,
  auth,
  routing
});

export default rootReducer;

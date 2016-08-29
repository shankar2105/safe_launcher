import ActionTypes from '../actions/action_types';
import moment from 'moment';

const initialState = {
  appList: {},
  appLogs: [],
  logFilter: [],
  appDetailPageVisible: false,
  currentApp: null,
  currentAppLogs: [],
  showAuthRequest: false,
  authRequestPayload: null,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_APP_DETAIL_PAGE:
      let app = state.appList[action.appId];
      return { ...state, appDetailPageVisible: true, currentApp: {
        ...app,
        permissions: app.permissions.slice(),
        status: { ...app.status }
      }, currentAppLogs: action.currentAppLogs };
      break;
    case ActionTypes.HIDE_APP_DETAIL_PAGE:
      return { ...state, appDetailPageVisible: false, currentApp: null, currentAppLogs: [] };
      break;
    case ActionTypes.SHOW_AUTH_REQUEST:
      return { ...state, showAuthRequest: true, authRequestPayload: action.payload };
      break;
    case ActionTypes.HIDE_AUTH_REQUEST:
      return { ...state, showAuthRequest: false, authRequestPayload: null };
      break;
    case ActionTypes.ADD_APPLICATION:
      let appList = { ...state.appList };
      appList[action.app.id] = {
        id: action.app.id,
        name: action.app.info.appName,
        version: action.app.info.appVersion,
        vendor: action.app.info.vendor,
        permissions: action.app.info.permissions.list,
        status: {
          beginTime: moment().format('HH:mm:ss'),
          activityName: 'Authorisation',
          activityStatus: 1
        },
        lastActive: moment().fromNow()
      };

      return { ...state, appList: appList};
      break;
    case ActionTypes.REVOKE_APPLICATION: {
      let appList = {};
      let list = null;
      for (var key of Object.keys(state.appList)) {
        list = state.appList[key];
        appList[key] = { ...list, status: { ...list.status }, permissions: list.permissions.slice() }
      }
      delete appList[action.appId];
      return { ...state, appList: appList, appDetailPageVisible: false, currentApp: null };
      break;
    }
    case ActionTypes.LOGOUT:
      return initialState;
      break;
    case ActionTypes.ADD_ACTIVITY: {
      let newActivity = { ...action.activityLog.activity, app: action.activityLog.app, appName: action.activityLog.appName };
      let appLogs = state.appLogs.slice();
      newActivity.beginTime = moment(newActivity.beginTime).format('HH:mm:ss')
      appLogs.unshift(newActivity);
      return { ...state , appLogs: appLogs };
      break;
    }
    case ActionTypes.UPDATE_ACTIVITY:
      let appLogs = state.appLogs.slice();
      let activityIndex = appLogs.map(function(obj) {
        return obj.activityId;
      }).indexOf(action.activityLog.activity.activityId);
      appLogs.splice(activityIndex, 1);
      let activity = { ...action.activityLog.activity, app: action.activityLog.app, appName: action.activityLog.appName };
      activity.beginTime = moment(activity.beginTime).format('HH:mm:ss')
      console.log(activity);
      appLogs.unshift(activity);

      let currentAppLogs = state.currentAppLogs.slice();
      if (state.appDetailPageVisible && (state.currentApp.id === action.activityLog.app)) {
        let currentAppActivityIndex = currentAppLogs.map(function(obj) {
          return obj.activityId;
        }).indexOf(action.activityLog.activity.activityId);
        currentAppLogs.splice(currentAppActivityIndex, 1);
        currentAppLogs.unshift(activity);
      }

      return { ...state , appLogs: appLogs, currentAppLogs: currentAppLogs };
      break;
    case ActionTypes.SET_LOGS_FILTER:
      return { ...state, logFilter: action.fields }
      break;
    case ActionTypes.RESET_LOGS_FILTER:
      return { ...state, logFilter: [] }
      break;
    default:
      return state;
  }
};

export default user;

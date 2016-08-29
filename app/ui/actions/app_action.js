import ActionTypes from './action_types';

export const showAppDetailPage = (appId) => {
  let currentAppLogs = window.msl.getAppActivityList(appId);
  return {
    type: ActionTypes.SHOW_APP_DETAIL_PAGE,
    appId: appId,
    currentAppLogs: currentAppLogs
  };
}

export const hideAppDetailPage = () => {
  return {
    type: ActionTypes.HIDE_APP_DETAIL_PAGE
  };
}

export const showAuthRequest = (payload) => {
  return {
    type: ActionTypes.SHOW_AUTH_REQUEST,
    payload: payload
  };
}

export const hideAuthRequest = (payload, status) => {
  window.msl.authResponse(payload, status);
  return {
    type: ActionTypes.HIDE_AUTH_REQUEST
  };
}

export const addApplication = (app) => {
  return {
    type: ActionTypes.ADD_APPLICATION,
    app: app
  };
}

export const revokeApplication = (appId) => {
  window.msl.removeSession(appId);
  return {
    type: ActionTypes.REVOKE_APPLICATION,
    appId: appId
  };
}

export const addActivity = (activityLog) => {
  return {
    type: ActionTypes.ADD_ACTIVITY,
    activityLog: activityLog
  };
}

export const updateActivity = (activityLog) => {
  return {
    type: ActionTypes.UPDATE_ACTIVITY,
    activityLog: activityLog
  };
}

export const setLogsFilter = (fields) => {
  return {
    type: ActionTypes.SET_LOGS_FILTER,
    fields: fields
  };
}

export const resetLogsFilter = () => {
  return {
    type: ActionTypes.RESET_LOGS_FILTER
  };
}

export const setDownloadData = (downloadData) => {
  return {
    type: ActionTypes.SET_DOWNLOAD_DATA,
    downloadData: downloadData
  };
}

export const setUploadData = (uploadData) => {
  return {
    type: ActionTypes.SET_UPLOAD_DATA,
    uploadData: uploadData
  };
}

export const setUnAuthStateData = (data) => {
  return {
    type: ActionTypes.SET_UNAUTH_STATE_DATA,
    data: data
  };
}

export const setAuthStateData = (data) => {
  return {
    type: ActionTypes.SET_AUTH_STATE_DATA,
    data: data
  };
}

export const setDashGetCount = (data) => {
  return {
    type: ActionTypes.SET_DASH_GET_COUNT,
    data: data
  };
}

export const setDashPostCount = (data) => {
  return {
    type: ActionTypes.SET_DASH_POST_COUNT,
    data: data
  };
}

export const setDashDeleteCount = (data) => {
  return {
    type: ActionTypes.SET_DASH_DELETE_COUNT,
    data: data
  };
}

export const setDashPutCount = (data) => {
  return {
    type: ActionTypes.SET_DASH_PUT_COUNT,
    data: data
  };
}

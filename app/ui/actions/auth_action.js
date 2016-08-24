import ActionTypes from './action_types';
import axios from 'axios';

export const loginSuccess = (res) => {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    user: res
  };
}

export const loginError = (err) => {
  return {
    type: ActionTypes.LOGIN_ERROR,
    error: err
  };
}

export const login = (payload) => {
  return dispatch => {
    window.msl.login(payload.accountSecret, payload.accountPassword, (err, res) => {
      if (err) {
        dispatch(loginError(err))
      } else {
        dispatch(loginSuccess(payload))
      }
    });
  }
}

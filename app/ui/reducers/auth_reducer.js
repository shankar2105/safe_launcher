import ActionTypes from '../actions/action_types';

const auth = (state = {
  authProcessing: false,
  authenticated: false,
  error: null,
  user: null
}, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      if (!state.authProcessing) {
        return state;
      }
      return { ...state, authenticated: true, user: action.user, authProcessing: false }
      break;
    case ActionTypes.LOGIN_ERROR:
      if (!state.authProcessing) {
        return state;
      }
      return { ...state, error: action.error, authProcessing: false }
      break;
    case ActionTypes.AUTH_PROCESSING:
      return { ...state, authProcessing: true }
      break;
    case ActionTypes.AUTH_CANCEL:
      return { ...state, authProcessing: false }
      break;
    default:
      return state;
  }
};

export default auth;

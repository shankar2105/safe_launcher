import ActionTypes from '../actions/action_types';

const auth = (state = {
  authenticated: false,
  error: null,
  user: null
}, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return { ...state, authenticated: true, user: action.user }
      break;
    case ActionTypes.LOGIN_ERROR:
      return { ...state, error: action.error }
      break;
    default:
      return state;
  }
};

export default auth;

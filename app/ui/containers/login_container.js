import { connect } from 'react-redux';
import Login from '../components/login';
import { login } from '../actions/auth_action';

const mapStateToProps = function(state) {
  return {
    authenticated: state.auth.authenticated,
    user: state.auth.user,
    error: state.auth.error
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    userLogin: (payload) => {
      dispatch(login(payload))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

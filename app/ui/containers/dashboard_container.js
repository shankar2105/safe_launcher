import { connect } from 'react-redux';
import Dashboard from '../components/dashboard';

const mapStateToProps = function(state) {
  return {
    authenticated: state.auth.authenticated,
    dashData: state.user.dashData,
    unAuthGET: state.user.unAuthGET,
    authHTTPMethods: state.user.authHTTPMethods
  };
}

const mapDispatchToProps = function(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

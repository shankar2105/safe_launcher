import { connect } from 'react-redux';
import Home from '../components/home';

const mapStateToProps = function(state) {
  return {
    // status: state.networkStatus.networkStatus
  };
}

const mapDispatchToProps = function(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

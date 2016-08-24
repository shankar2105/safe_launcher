import { connect } from 'react-redux';
import Account from '../components/account';

const mapStateToProps = function(state) {
  return {
    // status: state.networkStatus.networkStatus
  };
}

const mapDispatchToProps = function(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);

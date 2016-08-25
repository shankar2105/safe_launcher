import { connect } from 'react-redux';
import AccountAppList from '../components/account_app_list';

const mapStateToProps = function(state) {
  return {
    // status: state.networkStatus.networkStatus
  };
}

const mapDispatchToProps = function(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountAppList);

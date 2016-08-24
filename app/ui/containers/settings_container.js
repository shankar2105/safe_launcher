import { connect } from 'react-redux';
import Settings from '../components/settings';
import { toggleProxy } from '../actions/proxy_action';

const mapStateToProps = function(state) {
  return {
    proxy: state.proxy.proxy
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    onProxyClick: () => {
      dispatch(toggleProxy())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

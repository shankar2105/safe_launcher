import React, { Component, PropTypes } from 'react';

export default class Home extends Component {
  constructor() {
    super();
  }

  render() {
    const { location, cancelAuthReq } = this.props;
    const pathname = location.pathname;
    return (
      <div className="auth-loader">{ $state.params.currentPage === 'register' ? 'Registering' : 'Logging'  }
        <h3 className="title">{ pathname === '/register' ? 'Registering' : 'Logging' } you on the SAFE Network!</h3>
        <span className="loader"></span>
        <div className="opt">
          <div className="opt-i">
            <button type="button" className="btn primary" name="cancel" onClick={() => {
              cancelRequest()
            }}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

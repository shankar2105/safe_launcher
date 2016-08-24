import React, { Component, PropTypes } from 'react';
import className from 'classnames';

export default class Account extends Component {
  render() {
    return (
      <div className="auth">
        <div className="auth-b">
          { this.props.children }
        </div>
      </div>
    )
  }
}

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import className from 'classnames';

export default class Home extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  render() {
    const { router } = this.context;

    return (
      <div className="tab">
        <div className="tab-b">
          <div className="tab-nav">
            <ul>
              <li className={className({ 'active': this.context.router.isActive('/account') })}>
                <Link to="/account">
                  <span className="icn account-icn"></span>
                  <span className="txt">Account</span>
                </Link>
              </li>
              <li className={className({ 'active': this.context.router.isActive('/dashboard') })}>
                <Link to="/account">
                  <span className="icn dashboard-icn"></span>
                  <span className="txt">Dashboard</span>
                </Link>
              </li>
              <li className={className({ 'active': this.context.router.isActive('/logs') })}>
                <Link to="/account">
                  <span className="icn log-icn"></span>
                  <span className="txt">Logs</span>
                </Link>
              </li>
              <li className={className({ 'active': this.context.router.isActive('/settings') })}>
                <Link to="/settings">
                  <span className="icn settings-icn"></span>
                  <span className="txt">Settings</span>
                </Link>
              </li>
              <li className={className({ 'active': this.context.router.isActive('/help') })}>
                <Link to="/account">
                  <span className="icn help-icn"></span>
                  <span className="txt">Help</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="tab-cnt">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}

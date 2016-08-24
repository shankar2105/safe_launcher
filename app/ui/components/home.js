import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import className from 'classnames';

export default class Home extends Component {
  render() {
    const { location } = this.props;
    const pathname = location.pathname;
    return (
      <div className="tab">
        <div className="tab-b">
          <div className="tab-nav">
            <ul>
              <li className={(pathname === '/account' || pathname === '/home' )? 'active' : ''}>
                <Link to="/account">
                  <span className="icn account-icn"></span>
                  <span className="txt">Account</span>
                </Link>
              </li>
              <li className={(pathname === '/dashboard')? 'active' : ''}>
                <Link to="/account">
                  <span className="icn dashboard-icn"></span>
                  <span className="txt">Dashboard</span>
                </Link>
              </li>
              <li className={(pathname === '/logs')? 'active' : ''}>
                <Link to="/account">
                  <span className="icn log-icn"></span>
                  <span className="txt">Logs</span>
                </Link>
              </li>
              <li className={(pathname === '/settings')? 'active' : ''}>
                <Link to="/settings">
                  <span className="icn settings-icn"></span>
                  <span className="txt">Settings</span>
                </Link>
              </li>
              <li className={(pathname === '/help')? 'active' : ''}>
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

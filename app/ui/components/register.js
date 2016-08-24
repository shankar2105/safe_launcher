import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import className from 'classnames';
import { openExternal } from '../utils/app_utils';

export default class Settings extends Component {
  static propTypes = {
  };

  render() {
    return (
      <div className="form-b">
        <form className="form" name="loginForm">
          <div id="errorTarget" className="inp-grp">
            <input id="accountSecret" type="password" ref="accountSecret" required="true" />
            <label htmlFor="accountSecret">Account Secret</label>
            <div className="msg"></div>
            <div className="opt">
              <div className="opt-i">
                  <span className="eye"></span>
              </div>
            </div>
          </div>
          <div className="inp-grp">
            <input id="accountPassword" type="password" ref="accountPassword" required="true" />
            <label htmlFor="accountPassword">Account Password</label>
            <div className="msg"></div>
            <div className="opt">
              <div className="opt-i">
                  <span className="eye"></span>
              </div>
            </div>
          </div>
          <div className="inp-btn">
            <button type="submit" className="btn primary" name="login">Login</button>
          </div>
        </form>
        <div className="form-f">
          <div className="form-f-b">
            Don&rsquo;t have a account ? <a>Create Account</a>
          </div>
        </div>
      </div>
    )
  }
}

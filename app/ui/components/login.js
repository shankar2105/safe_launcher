import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import className from 'classnames';
import { openExternal } from '../utils/app_utils';
import AuthLoader from './auth_loader';

export default class Settings extends Component {
  static propTypes = {
    userLogin: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    authProcessing: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillUpdate(nextProps) {
    if (nextProps.authenticated) {
      return this.context.router.push('/account_list');
    }
  }

  onFocus() {
    this.errMsg = null;
  }

  handleLogin(e) {
    e.preventDefault();
    const { userLogin } = this.props;
    let accountSecretVal = accountSecret.value.trim()
    let accountPasswordVal = accountPassword.value.trim();
    if (!accountSecretVal || !accountPasswordVal) {
      return;
    }
    this.isLoading = true;
    userLogin({
      accountSecret: accountPasswordVal,
      accountPassword: accountPasswordVal
    });
  }

  render() {
    const { error, user, authenticated, authProcessing } = this.props;
    if (authProcessing) {
      return <AuthLoader {...this.props}/>
    }
    this.errMsg = null;
    if (error) {
      this.errMsg = window.msl.errorCodeLookup(error.errorCode || 0);
      switch (this.errMsg) {
        case 'CoreError::RequestTimeout':
          this.errMsg = 'Request timed out';
          break;
        case 'CoreError::GetFailure::GetError::NoSuchAccount':
        case 'CoreError::GetFailure::GetError::NoSuchData':
          this.errMsg = 'Account not found';
          break;
        case 'CoreError::SymmetricDecipherFailure':
          this.errMsg = 'Invalid password';
          break;
        default:
          this.errMsg = this.errMsg.replace('CoreError::', '');
      }
      this.errMsg = 'Login failed. ' + this.errMsg;
    }

    let inputGrpClassNames = className(
      'inp-grp',
      { 'error': this.errMsg }
    );

    return (
      <div className="form-b">
        <form className="form" name="loginForm" onSubmit={this.handleLogin}>
          <div id="errorTarget" className={inputGrpClassNames}>
            <input id="accountSecret" type="password" ref="accountSecret" required="true" onFocus={ this.onFocus } autoFocus />
            <label htmlFor="accountSecret">Account Secret</label>
            <div className="msg">{ this.errMsg ? this.errMsg : '' }</div>
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

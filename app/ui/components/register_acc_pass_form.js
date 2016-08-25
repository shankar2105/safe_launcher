import React, { Component, PropTypes } from 'react';

export default class RegisterAccPassForm extends Component {
  constructor() {
    super();
    this.handleAccPassForm = this.handleAccPassForm.bind(this);
  }

  handleAccPassForm(e) {
    e.preventDefault();
    let accountPasswordVal = accountPassword.value.trim();
    let confirmAccountPasswordVal = confirmAccountPassword.value.trim();
    if (!accountPasswordVal && !confirmAccountPasswordVal) {
      return;
    }
    if (accountPasswordVal === confirmAccountPasswordVal) {
      this.props.userRegister({
        accountSecret: this.props.user.accountSecret,
        accountPassword: accountPasswordVal
      });
    }
  }

  render() {
    return (
      <div className="auth-intro-cnt">
        <h3 className="title">Account Password</h3>
        <div className="desc">
          Your 'account password' is <b>never stored or transmitted</b>, it will not leave your computer.
        </div>
        <div className="form-b">
          <form id="accountPasswordForm" className="form" name="accountPasswordForm">
            <div id="AccountPass" className="inp-grp validate-field light-theme">
              <input id="accountPassword" type="password" ref="accountPassword" required="true" autoFocus />
              <label htmlFor="accountPassword">Account Password</label>
              <div className="msg"></div>
              <div className="opt">
                <div className="opt-i">
                    <span className="eye"></span>
                </div>
              </div>
              <span className="strength"></span>
              <span className="status last" data-val="min"></span>
            </div>
            <div id="AccountPassConfirm" className="inp-grp light-theme">
              <input id="confirmAccountPassword" type="password" ref="confirmAccountPassword" required="true" />
              <label htmlFor="confirmAccountPassword">Confirm Account Password</label>
              <div className="msg"></div>
              <div className="opt">
                <div className="opt-i">
                    <span className="eye"></span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="opt align-btn-box">
          <div className="opt-i lt">
            <button type="button lt" className="btn" name="back" onClick={e => {
              this.props.stateBack()
            }}>Back</button>
          </div>
          <div className="opt-i">
            <button type="submit" className="btn btn-box" name="continue" onClick={this.handleAccPassForm}>Create Account</button>
          </div>
        </div>
      </div>
    )
  }
}

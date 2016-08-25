import React, { Component, PropTypes } from 'react';

export default class RegisterAccSecretForm extends Component {
  constructor() {
    super();
    this.handleAccSecretForm = this.handleAccSecretForm.bind(this);
  }

  handleAccSecretForm(e) {
    e.preventDefault();
    let accountSecretVal = accountSecret.value.trim();
    let confirmAccountSecretVal = confirmAccountSecret.value.trim();
    if (!accountSecretVal && !confirmAccountSecretVal) {
      return;
    }
    if (accountSecretVal === confirmAccountSecretVal) {
      this.props.stateContinue({
        accountSecret: accountSecretVal
      });
    }
  }

  render() {
    return (
      <div className="auth-intro-cnt">
        <h3 className="title">Account Secret</h3>
        <div className="desc">
          Your 'account secret' is private and <b>should not be shared</b> with anyone.
        </div>
        <div className="form-b">
          <form id="accountSecretForm" className="form" name="accountSecretForm">
            <div id="AccountSecret" className="inp-grp validate-field light-theme">
              <input id="accountSecret" type="password" ref="accountSecret" required="true" autoFocus />
              <label htmlFor="accountSecret">Account Secret</label>
              <div className="msg"></div>
              <div className="opt">
                <div className="opt-i">
                    <span className="eye"></span>
                </div>
              </div>
              <span className="strength"></span>
              <span className="status" data-val="min"></span>
            </div>
            <div id="AccountSecretConfirm" className="inp-grp light-theme">
              <input id="confirmAccountSecret" type="password" ref="confirmAccountSecret" required="true" />
              <label htmlFor="confirmAccountSecret">Confirm Account Secret</label>
              <div className="msg"></div>
              <div className="opt">
                <div className="opt-i">
                    <span className="eye"></span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="opt">
          <div className="opt-i lt">
            <button type="button" className="btn" name="back" onClick={e => {
              this.props.stateBack()
            }}>Back</button>
          </div>
          <div className="opt-i">
            <button type="submit" className="btn" name="continue" onClick={this.handleAccSecretForm}>Continue</button>
          </div>
        </div>
      </div>
    )
  }
}

import React, { Component, PropTypes } from 'react';

export default class AccountStorageChart extends Component {
  constructor() {
    super()
  }

  render() {
    const { dashData } = this.props;

    return (
      <div className="sec-2">
        <div className="card">
          <div className="dash-progress-bar">
            <div className="dash-progress-bar-b">
              <h3 className="dash-title">Account Storage</h3>
              <h3 className="count"><span className="value">{dashData.accountStorageUsed}</span> / {dashData.accountStorageUsed + dashData.accountStorageAvailable}</h3>
              <h3 className="count" style={{display: 'none'}}><span className="value">...</span></h3>
              <h4 className="title">Total PUTs</h4>
              <div className="progress">
                <span className="progress-value" style={{ width : ((dashData.accountStorageUsed / (dashData.accountStorageUsed + dashData.accountStorageAvailable)) * 100) + '%'}}></span>
              </div>
              <div className="desc">
                Each account is currently limited to {dashData.accountStorageUsed + dashData.accountStorageAvailable} PUTs on the Network.
              </div>
              <div className="desc" style={{display: 'none'}}>
                Fetching data from the Network.
              </div>
              <div className="opt">
                <div className="opt-lt">
                  <button type="button" className="btn flat" name="update">Update</button>
                </div>
                <div className="opt-rt">
                  Updated:
                </div>
              </div>
              <div className="opt onLoading" style={{display: 'none'}}>
                <div className="opt-lt">
                  <button type="button" className="btn flat" name="update">Updating</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

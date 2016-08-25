import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import className from 'classnames';

export default class AccountAppList extends Component {
  render() {
    console.log(this.props.location);
    return (
      <div>App list</div>
    )
  }
}

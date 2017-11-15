import Radium from 'radium'
import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router'

import { redirect } from 'actions/routing'

import AuthenticationRequired from 'components/AuthenticationRequired'

@connect()
@AuthenticationRequired
@Radium
class Profile extends React.Component {
  render() {
    let { match, session } = this.props;

    return (
      <div>
        <h1>Profile {session.id}</h1>
        <button onClick={this._redirectTo.bind(this, '/profile/me')}>My Profile</button>
        <Route path={`${match.path}/:id`} component={ProfileDetail} />
      </div>
    )
  }
  _redirectTo(pathname) {
    let { dispatch } = this.props

    dispatch(redirect(pathname))
  }
}

@connect()
@AuthenticationRequired
class ProfileDetail extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { params } = this.props.match

    return (
      <div>My profile: {params.id}</div>
    )
  }
}

export default Profile

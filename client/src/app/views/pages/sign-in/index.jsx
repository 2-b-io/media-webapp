import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'

import { mapDispatch } from 'services/redux-helpers'
import { actions } from 'state/interface'
import { Container, Link, Paragraph } from 'ui/elements'

import _SignInForm from './form'

const SignInForm = reduxForm({
  form: 'signIn',
  enableReinitialize: true
})(_SignInForm)

const SignIn = ({ signIn, toForgotPassword, toRegister }) => (
  <main>
    <Container center size="small">
      <SignInForm onSubmit={ signIn } />
      <Paragraph>
        Don't have your account yet?<br />
        <Link href="/register" onClick={ toRegister }>Try it for free!</Link>
      </Paragraph>
      <Paragraph>
        Trouble at signing in?<br />
        <Link href="/forgot-password" onClick={ toForgotPassword }>We are here for help.</Link>
      </Paragraph>
    </Container>
  </main>
)

export default connect(
  null,
  mapDispatch({
    signIn: credential => actions.createSession(credential),
    toForgotPassword: () => actions.requestLocation('/forgot-password'),
    toRegister: () => actions.requestLocation('/register')
  })
)(SignIn)

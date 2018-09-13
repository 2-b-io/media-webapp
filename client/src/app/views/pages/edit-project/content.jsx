import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'

import { Container } from 'ui/elements'
import { stateful } from 'views/common/decorators'
import { mapDispatch } from 'services/redux-helpers'
import { selectors, actions } from 'state/interface'
import { withParams } from 'views/router'

import _ProjectForm from './form'

const ProjectForm = reduxForm({
  form: 'project',
  enableReinitialize: true
})(_ProjectForm)

const EditProject = ({
  project,
  updateProject
}) => {
  return (
    <Container>
      <ProjectForm
        onSubmit={ ( { name, disabled }) => updateProject(project.identifier, name, disabled) }
        initialValues={ { name: project && project.name, provider: project && project.infrastructure.provider  } }
        provider={ project && project.infrastructure.provider }
      />
    </Container>
  )
}

export default withParams(
  stateful({
    component: 'EditProject'
  })(
    connect(
      (state, { params: { identifier } }) => ({
        project: selectors.findProjectByIdentifier(state, identifier),
      }),
      mapDispatch({
        updateProject: (identifier, name, disabled) => actions.updateProject({ identifier, name, disabled })
      })
    )(EditProject)
  )
)
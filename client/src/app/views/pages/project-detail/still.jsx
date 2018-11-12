import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { mapDispatch } from 'services/redux-helpers'
import { actions, selectors } from 'state/interface'
import { Button } from 'ui/elements'
import { BackIcon } from 'ui/icons'
import { PageTitle } from 'ui/typo'

const ProjectDetail = ({ navigateBack, project = {} }) => (
  <Fragment>
    <Button>
      <BackIcon onClick={ navigateBack } />
    </Button>
    <PageTitle>{ project.name }</PageTitle>
  </Fragment>
)

export default connect(
  (state) => {
    const { identifier } = selectors.currentParams(state)

    return {
      project: selectors.findProjectByIdentifier(state, identifier)
    }
  },
  mapDispatch({
    navigateBack: () => actions.requestLocation('/projects')
  })
)(ProjectDetail)

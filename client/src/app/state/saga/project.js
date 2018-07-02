import { call, take, fork, put, select } from 'redux-saga/effects'
import serializeError from 'serialize-error'

import Project from 'models/project'
import { actions, types, selectors } from 'state/interface'

const createLoop = function*() {
  while (true) {
    const action = yield take(types['PROJECT/CREATE'])
    const { project } = action.payload

    try {
      const session = yield select(selectors.currentSession)

      if (!session) {
        continue
      }

      const newProject = yield call(Project.create, project, session.token)

      yield put(actions.createProjectCompleted(newProject))
    } catch (e) {
      yield put(actions.createProjectFailed(serializeError(e)))
      continue
    }
  }
}

const getLoop = function*() {
  while (true) {
    const action = yield take(types['PROJECT/GET'])
    const { slug } = action.payload

    try {
      const session = yield select(selectors.currentSession)

      if (!session) {
        continue
      }

      const project = yield call(Project.get, slug, session.token)

      yield put(actions.getProjectCompleted(project))
    } catch (e) {
      yield put(actions.getProjectFailed(serializeError(e)))
      continue
    }
  }
}

const fetchLoop = function*() {
  while (true) {
    yield take(types['PROJECT/FETCH'])

    try {
      const session = yield select(selectors.currentSession)

      if (!session) {
        continue
      }

      const projects = yield call(Project.fetch, session.token)

      yield put(actions.fetchProjectsCompleted(projects))
    } catch (e) {
      yield put(actions.fetchProjectsFailed(serializeError(e)))
      continue
    }
  }
}

export default function*() {
  yield take('@@INITIALIZED')
  yield fork(createLoop)
  yield fork(fetchLoop)
  yield fork(getLoop)
}

import { call, take, fork, put, select } from 'redux-saga/effects'
import serializeError from 'serialize-error'

import ProjectMedia from 'models/project-media'
import { actions, types, selectors } from 'state/interface'

const fetchProjectMediaLoop = function*() {
  while (true) {
    const action = yield take(types['PROJECTMEDIA/FETCH_PROJECT_MEDIA'])

    try {
      const session = yield select(selectors.currentSession)
      if (!session) {
        continue
      }

      const projectMediaList = yield call(ProjectMedia.fetchProjectMedia, session.token, action.payload.slug)

      yield put(actions.fetchProjectsCompleted(projectMediaList))
    } catch (e) {
      yield put(actions.fetchProjectsFailed(serializeError(e)))
      continue
    }
  }
}


export default function*() {
  yield take('@@INITIALIZED')
  yield fork(fetchProjectMediaLoop)

}

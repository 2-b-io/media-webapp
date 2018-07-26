import { combineReducers } from 'redux'
import arrayToMap from 'state/helpers/array-to-map'
import createReducer from 'state/helpers/create-reducer'

import * as types from './types'

export default combineReducers({
  projects: createReducer({})({
    [ types.FETCH_COMPLETED ]: (state, action) => {
      return action.payload.projects.reduce(
        (projects, project) => ({
          ...projects,
          [ project.slug ]: {
            ...project,
            collaborators: arrayToMap(project.collaborators, '_id'),
            presets: arrayToMap(project.presets, 'hash')
          }
        }), {}
      )
    },
    [ types.CREATE_COMPLETED ]: (state, action) => ({
      ...state,
      [ action.payload.project.slug ]: {
        ...action.payload.project,
        presets: arrayToMap(action.payload.project.presets, 'hash')
      }
    }),
    [ types.GET_COMPLETED ]: (state, action) => ({
      ...state,
      [ action.payload.project.slug ]: {
        ...action.payload.project,
        presets: arrayToMap(action.payload.project.presets, 'hash'),
        collaborators: arrayToMap(action.payload.project.collaborators, '_id'),

      }
    }),
    [ types.GET_PRESET_COMPLETED ]: (state, action) => {
      const { preset, slug }  = action.payload

      return {
        ...state,
        [ slug ]: {
          ...state[ slug ],
          presets: {
            ...state[ slug ].presets,
            [ preset.hash ]: preset
          }
        }
      }
    },
    [ types.CREATE_PRESET_COMPLETED ]: (state, action) => {
      const { preset, slug } = action.payload

      return {
        ...state,
        [ slug ]: {
          ...state[ slug ],
          presets: {
            ...state[ slug ].presets,
            [ preset.hash ]: preset
          }
        }
      }
    },
    [ types.UPDATE_PRESET_COMPLETED ]: (state, action) => {
      const { preset, slug } = action.payload

      return {
        ...state,
        [ slug ]: {
          ...state[ slug ],
          presets: {
            ...state[ slug ].presets,
            [ preset.hash ]: preset
          }
        }
      }
    },
    [ types.DELETE_PRESET_COMPLETED ]: (state, action) => {
      const { preset: { hash }, slug } = action.payload
      const { [ hash ]: removedPreset, ...remainPresets } = state[ slug ].presets
      return {
        ...state,
        [ slug ]: {
          ...state[ slug ],
          presets: remainPresets
        }
      }
    },
    [ types.INVITE_COLLABORATOR_COMPLETED ]: (state, action) => {
      const { slug }  = action.payload.collaborator
      const { collaborator } = action.payload
      const project = state[ slug ]

      return {
        ...state,
        [ slug ]: {
          ...project,
          collaborators: {
            ...state[ slug ].collaborators,
            [ collaborator._id ]: collaborator
          }
        }
      }
    }
  }),
})

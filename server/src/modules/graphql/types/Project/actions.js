import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import projectService from 'services/project'

import { Collaborator } from '../Collaborator'
import { Invalidation } from '../invalidation'
import { Preset, PresetStruct } from '../preset'

import createPresetService from 'services/preset'
import createCollaboratorService from 'services/collaborator'

export default ({ Project, ProjectStruct }) => ({
  _update: {
    args: {
      project: {
        type: new GraphQLNonNull(ProjectStruct)
      }
    },
    type: Project,
    resolve: async (self, { project }) => {
      const p = await projectService.update({
        identifier: self.identifier
      }, self.account._id, project)

      // add ref
      p.account = self.account

      return p
    }
  },
  _destroy: {
    type: GraphQLBoolean,
    resolve: async (self) => {
      return await projectService.remove({
        identifier: self.identifier
      }, self.account)
    }
  },
  _createPreset: {
    args: {
      preset: {
        type: new GraphQLNonNull(PresetStruct)
      }
    },
    type: Preset,
    resolve: async (project, { preset }, ctx) => {
      const presetService = createPresetService(ctx._session.account.identifier)
      const newPreset = await presetService.create(project.identifier, {
        contentType: preset.contentType
      })

      return {
        ...newPreset,
        project
      }
    }
  },
  _addCollaboratorsByEmails: {
    args: {
      emails: {
        type: GraphQLNonNull(GraphQLList(GraphQLString))
      },
      message: {
        type: GraphQLString
      }
    },
    type: GraphQLList(Collaborator),
    resolve: async (project, { emails, message }, ctx) => {
      const collaboratorService = createCollaboratorService(ctx._session.account.identifier)
      const collaborators = await collaboratorService.invite(project.identifier, {
        emails,
        message
      })

      return collaborators.map(
        (collaborator) => {
          return ({
            ...collaborator,
            project
          })
        }
      )
    }
  },
  _removeCollaborator: {
    args: {
      accountId: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    type: GraphQLBoolean,
    resolve: async (project, { accountId: accountIdentifier }, ctx) => {
      const collaboratorService = createCollaboratorService(ctx._session.account.identifier)
      await collaboratorService.remove(project.identifier, accountIdentifier)

      return true
    }
  },
  _makeOwner: {
    args: {
      accountId: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    type: GraphQLBoolean,
    resolve: async (project, { accountId: accountIdentifier }, ctx) => {
      const collaboratorService = createCollaboratorService(ctx._session.account.identifier)
      await collaboratorService.makeOwner(project.identifier, accountIdentifier)

      return true
    }
  },
  _invalidateCache: {
    args: {
      patterns: {
        type: GraphQLNonNull(GraphQLList(GraphQLString))
      }
    },
    type: Invalidation,
    resolve: async (project, { patterns }) => {
      const { identifier } = project
      return await projectService.invalidateCache(identifier, patterns)
    }
  }
})

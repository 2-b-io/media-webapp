import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import createAccountService from 'services/account'
import createResetPasswordService from 'services/reset-password-code'

import { Account, AccountStruct } from '../types/account'

export default () => ({
  _createAccount: {
    args: {
      account: {
        type: new GraphQLNonNull(AccountStruct)
      }
    },
    type: Account,
    resolve: async (rootValue, { account }) => {
      const accountService = createAccountService()

      return await accountService.create(account)
    }
  },
  _forgotPassword: {
    args: {
      email: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    type: GraphQLBoolean,
    resolve: async (rootValue, { email }) => {
      const resetPasswordService = createResetPasswordService()
      await resetPasswordService.forgotPassword({ email })

      return true
    }
  },
  _resetPassword: {
    args: {
      account: {
        type: GraphQLNonNull(AccountStruct)
      },
      code: {
        type: GraphQLNonNull(GraphQLString)
      },
    },
    type: GraphQLBoolean,
    resolve: async (rootValue, { account, code }) => {
      //get account by reset token
      const resetPasswordService = createResetPasswordService()
      const { accountIdentifier } = await resetPasswordService.getResetCode({ token: code })

      const accountService = createAccountService(accountIdentifier)

      //update account name
      await accountService.update(accountIdentifier, { name: account.name })

      //change password by account identifier
      const updatedAccount = await accountService.changePassword(accountIdentifier, {
        token: code,
        newPassword: account.password
      })

      return updatedAccount
    }
  },
  resetCode: {
    args: {
      code: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    type: Account,
    resolve: async (rootValue, { code }) => {
      const resetPasswordService = createResetPasswordService()
      const { accountIdentifier } = await resetPasswordService.getResetCode({ token: code })

      const accountService = createAccountService(accountIdentifier)
      const account = await accountService.get(accountIdentifier)

      return account
    }
  }
})

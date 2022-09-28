'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

import UnAuthorized from 'App/Exceptions/UnAuthorizedException'

class Is {
  async handle({ auth }, next, ...args) {
    let expression = args[0]
    if (Array.isArray(expression)) {
      expression = expression[0]
    }
    const is = await auth.user.is(expression)
    if (!is) {
      throw new UnAuthorized('auth.unauthorized', 404, 'E_UNAUTHORIZED_EXCEPTION')
    }

    await next()
  }
}

export default Is

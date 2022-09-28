// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import LoginValidator from 'App/Validators/Auth/LoginValidator'

export default class LoginController {
  public async index({ auth }) {
    return User.getResponse(1, 'auth.validToken', auth.user)
  }
  public async store({ auth, request }) {
    await request.validate(LoginValidator)

    let res = await User.doLogin(auth, request.all())

    return res
  }

  public async destroy({ auth }) {
    await auth.use('api').revoke()
    return User.getResponse(1, 'auth.loggedOut')
  }
}

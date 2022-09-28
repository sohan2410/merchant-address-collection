// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import ActivateValidator from 'App/Validators/User/ActivateValidator'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public required = ['firstName', 'lastName']
  public async update({ auth, request }) {
    await request.validate(UserValidator)
    const user = await User.find(auth.user.id)
    if (!user) return User.getResponse(0, 'auth.accountNotFound')
    user.merge(request.only(this.required))
    if (request.file('image')) {
      let profilePic = await User.fileUpload(request, 'image', 1, ['jpg', 'jpeg', 'png', 'svg', 'jfif'])

      if (!profilePic || !profilePic.error) return (profilePic && profilePic) || User.getResponse(0, 'auth.provideValidImage')

      if (profilePic.data) user.image = profilePic.data
    }

    await user.save()
    return User.getResponse(1, 'auth.accountDetailsUpdated', user)
  }

  public async deactivateUser({ request }) {
    await request.validate(ActivateValidator)
    const { email } = request.all()
    const user = await User.findBy('email', email)
    if (!user) return User.getResponse(0, 'auth.user.userNotFound')

    if (user.status === 'inactive') return User.getResponse(0, 'auth.user.alreadyInActive')

    user.status = 'inactive'
    user.save()

    return User.getResponse(1, 'auth.user.statusUpdated')
  }

  public async activateUser({ request }) {
    await request.validate(ActivateValidator)
    const { email } = request.all()
    const user = await User.findBy('email', email)
    if (!user) return User.getResponse(0, 'auth.user.userNotFound')

    if (user.status === 'active') return User.getResponse(0, 'auth.user.alreadyActive')

    user.status = 'active'
    user.save()

    return User.getResponse(1, 'auth.user.statusUpdated')
  }
}

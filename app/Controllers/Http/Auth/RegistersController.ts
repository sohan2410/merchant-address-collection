// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bull from '@ioc:Rocketseat/Bull'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import EMAIL_JOB from 'App/Jobs/Email'
export default class RegistersController {
  public async store({ request }) {
    const { email, password, firstName, lastName } = request.all()
    const data = await request.validate(RegisterValidator)
    data.roleId = 3

    const user = await User.create(data)

    let email_data = { email, password, name: firstName + ' ' + lastName, button: { url: '#', label: 'Login' }, locale: 'en' }

    await Bull.schedule(new EMAIL_JOB().key, { data: email_data, type: 'registerUser' }, 1 * 1000)

    return User.getResponse(1, 'auth.registrationComplete', user)
  }
}

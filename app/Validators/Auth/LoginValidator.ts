import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    username: schema.string(),
    // email: schema.string.optional({}, [
    //   rules.email(),
    //   rules.exists({ table: 'users', column: 'email' }),
    // ]),
    password: schema.string([rules.regex(/^\d{4}$/)]),
    // mobile: schema.number([rules.exists({ table: 'users', column: 'mobile' })]),
    // country: schema.number([rules.range(1, 999)]),
  })

  // public messages = {}
  public messages = this.ctx.i18n.validatorMessages('validation.register')
}

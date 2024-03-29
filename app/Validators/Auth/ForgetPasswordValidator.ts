import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class ForgetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = MyReporter
  public schema = schema.create({
    username: schema.string({}, [rules.email(), rules.exists({ table: 'users', column: 'email' })]),
    otp: schema.string.optional({}, [rules.maxLength(4)]),
    password: schema.string.optional({}, [rules.regex(/^\d{4}$/), rules.minLength(4), rules.confirmed()]),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.ForgetPassword')
}

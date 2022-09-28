import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class ActivateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    id: this.ctx.auth?.user?.id || 0,
  })
  public reporter = MyReporter
  public schema = schema.create({
    email: schema.string([rules.regex(/^[A-Za-z0-9]+(.|_)+[A-Za-z0-9]+@+moxey.ai$/), rules.exists({ table: 'users', column: 'email' })]),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.user')
}

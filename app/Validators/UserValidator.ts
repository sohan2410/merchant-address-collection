import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    id: this.ctx.auth?.user?.id || 0,
  })
  public reporter = MyReporter
  public schema = schema.create({
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    email: schema.string.optional({}, [rules.email(), rules.unique({ table: 'users', column: 'email', whereNot: { id: this.refs.id } })]),
    dob: schema.date.optional(),
    gender: schema.string.optional(),
    mobile: schema.number.optional([rules.unique({ table: 'users', column: 'mobile', whereNot: { id: this.refs.id } })]),
    country: schema.number.optional([rules.range(1, 999)]),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.signup')
}

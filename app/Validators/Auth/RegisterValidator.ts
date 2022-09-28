import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    firstName: schema.string(),
    lastName: schema.string(),
    dob: schema.string.optional(),
    email: schema.string([rules.regex(/^[A-Za-z0-9]+(.|_)+[A-Za-z0-9]+@+moxey.ai$/), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string([rules.regex(/^\d{4}$/), rules.confirmed()]),
    mobile: schema.number([rules.unique({ table: 'users', column: 'mobile' })]),
    country: schema.string(),
    countryCode: schema.number([rules.range(1, 999)]),
    gender: schema.enum(['Male', 'Female', 'Others', 'male', 'female', 'others', 'Others']),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.register')
}

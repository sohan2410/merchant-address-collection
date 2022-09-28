import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class EmploymentValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter
  public schema = schema.create({
    workStatus: schema.number.optional([rules.exists({ table: 'configs', column: 'id' })]),
    professionalLevel: schema.number.optional([rules.exists({ table: 'configs', column: 'id' })]),
    employerName: schema.string.optional([rules.maxLength(20)]),
    workAddress: schema.string.optional([rules.maxLength(40)]),
    status: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.employment_details')
}

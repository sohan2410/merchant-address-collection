import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class EmploymentDetailValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter
  public schema = schema.create({
    driverId: schema.string([rules.exists({ table: 'drivers', column: 'driver_uuid' })]),
    workStatus: schema.number([rules.exists({ table: 'configs', column: 'id' })]),
    professionalLevel: schema.number([rules.exists({ table: 'configs', column: 'id' })]),
    employerName: schema.string([rules.maxLength(20)]),
    workAddress: schema.string([rules.maxLength(40)]),
    status: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.employment_details')
}

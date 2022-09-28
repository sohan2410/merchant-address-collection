import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class CommunicationDetailValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    driverId: schema.string([rules.exists({ table: 'drivers', column: 'driver_uuid' })]),
    streetName: schema.string.optional([rules.maxLength(40)]),
    country: schema.string(),
    city: schema.string(),
    zipCode: schema.number(),
    buildingNo: schema.number.optional(),
    status: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.communication_details')
}

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class CommunicationValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    // params: schema.object().members({
    //   id: schema.string([rules.exists({ table: 'drivers', column: 'driver_uuid' })]),
    // }),
    streetName: schema.string.optional([rules.maxLength(40)]),
    country: schema.string.optional(),
    city: schema.string.optional(),
    zipCode: schema.number.optional(),
    buildingNo: schema.number.optional(),
    status: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.communication_details')
}

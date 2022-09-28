import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class OtherDetailValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    driverId: schema.string([rules.exists({ table: 'drivers', column: 'driver_uuid' })]),
    usCitizenTaxpayer: schema.boolean(),
    usGreenCardHolder: schema.boolean(),
    relativesPoliticallyExposedPerson: schema.boolean(),
    relationshipWithCustomer: schema.number.optional([rules.exists({ table: 'configs', column: 'id' })]),
    cardDeliveryLocation: schema.string(),
    languageToCommunicate: schema.number([rules.exists({ table: 'configs', column: 'id' })]),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.other_details')
}

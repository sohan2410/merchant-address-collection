import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class OtherValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    usCitizenTaxpayer: schema.boolean.optional(),
    usGreenCardHolder: schema.boolean.optional(),
    relativesPoliticallyExposedPerson: schema.boolean.optional(),
    relationshipWithCustomer: schema.number.optional([rules.exists({ table: 'configs', column: 'id' })]),
    cardDeliveryLocation: schema.string.optional(),
    languageToCommunicate: schema.number.optional([rules.exists({ table: 'configs', column: 'id' })]),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.other_details')
}

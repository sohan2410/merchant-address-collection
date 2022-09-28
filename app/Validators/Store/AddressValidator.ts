import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class AddressValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    // storeId: schema.string([rules.unique({ table: 'store_addresses', column: 'store_id' }), rules.exists({ table: 'stores', column: 'id' })]),
    addressLine1: schema.string(),
    addressLine2: schema.string.optional(),
    locality: schema.string.optional([rules.maxLength(64)]),
    city: schema.string([rules.maxLength(64)]),
    region: schema.string(),
    country: schema.string(),
    noOfTollBoothsOnRoute: schema.number.optional([rules.range(0, 20)]),
    googleLocation: schema.object.optional().anyMembers(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.address')
}

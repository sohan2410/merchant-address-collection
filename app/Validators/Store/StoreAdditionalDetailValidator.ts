import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class StoreAdditionalDetailValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    // storeId: schema.string.optional([rules.uuid(), rules.exists({ table: 'stores', column: 'store_id' })]),
    noOfSmartPhones: schema.number.optional([rules.range(0, 20)]),
    noOfPosMachines: schema.number.optional([rules.range(0, 20)]),
    noOfAttendants: schema.number.optional([rules.range(1, 50)]),
    internetConnectivity: schema.boolean.optional(),
    comments: schema.string.optional(),
    socialLinks: schema.array.optional().anyMembers(),
    status: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.additional_details')
}

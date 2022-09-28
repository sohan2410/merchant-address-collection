import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class PersonnelDetailValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    // storeId: schema.string([rules.exists({ table: 'stores', column: 'store_id' })]),
    category: schema.string.optional(),
    name: schema.string.optional(),
    mobile: schema.string.optional([rules.maxLength(20)]),
    countryCode: schema.string.optional([rules.maxLength(20)]),
    email: schema.string.optional([rules.email()]),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.store')
}

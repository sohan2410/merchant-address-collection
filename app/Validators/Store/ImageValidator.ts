import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class ImageValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter
  public schema = schema.create({
    storeId: schema.string([rules.exists({ table: 'stores', column: 'store_id' })]),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.store')
}

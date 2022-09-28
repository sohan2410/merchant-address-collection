import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class StoreFilterValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    page: schema.number.optional([rules.unsigned()]),
    limit: schema.number.optional([rules.unsigned()]),
    status: schema.enum.optional(['active', 'inactive', 'draft', 'deleted']),
    category: schema.string.optional(),
    name: schema.string.optional(),
    user: schema.string.optional([rules.uuid()]),
    email: schema.string.optional([rules.email()]),
    approachdateGte: schema.date.optional(),
    approachdateGt: schema.date.optional(),
    approachdateLte: schema.date.optional(),
    approachdateLt: schema.date.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.store')
}

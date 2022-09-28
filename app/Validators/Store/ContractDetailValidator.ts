import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class ContractDetailValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    daysForOnboarding: schema.enum.optional(['0', '15', '30', '45', '60', '90', '100', '120']),
    contractStatus: schema.string.optional(),
    startDate: schema.string.optional([rules.regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)]),
    paymentTerms: schema.object.optional().anyMembers(),
    merchantDiscountRate: schema.string.optional([rules.maxLength(64)]),
    status: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.contract')
}

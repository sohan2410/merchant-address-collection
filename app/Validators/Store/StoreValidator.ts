import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'
export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(20)]),
    storeCategory: schema.string({}, [rules.maxLength(30)]),
    category: schema.enum(['Individual/Sole Proprietor', 'Company']),
    ownershipType: schema.enum(['Franchise', 'Owned', 'Branch', 'franchise', 'owned', 'branch']),
    approachDate: schema.string([rules.regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)]),
    paymentModeAccepted: schema.object().members({
      cash: schema.boolean.optional(),
      debit: schema.boolean.optional(),
      credit: schema.boolean.optional(),
      google_pay: schema.boolean.optional(),
      samsung_pay: schema.boolean.optional(),
      apple_pay: schema.boolean.optional(),
      emirates_wallet: schema.boolean.optional(),
      ali_pay: schema.boolean.optional(),
      stc_pay: schema.boolean.optional(),
      fawry_pay: schema.boolean.optional(),
      others: schema.string.optional(),
    }),
    status: schema.enum(['draft', 'active']),
    // openingTimings: schema.string([rules.regex(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z)?$/)]),
    // closingTimings: schema.string([rules.regex(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z)?$/)]),
    openingTimings: schema.string(),
    closingTimings: schema.string(),
    logo: schema.file.optional(),
  })

  // public messages = {}
  public messages = this.ctx.i18n.validatorMessages('validation.store')
}

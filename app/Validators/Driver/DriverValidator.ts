import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class DriverValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    firstNameEn: schema.string(),
    middleNameEn: schema.string.optional(),
    lastNameEn: schema.string(),
    firstNameAr: schema.string.optional(),
    middleNameAr: schema.string.optional(),
    lastNameAr: schema.string.optional(),
    nameOnCard: schema.string([rules.minLength(2), rules.maxLength(19)]),
    gender: schema.enum(['male', 'female', 'others']),
    dob: schema.string([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    mobile: schema.number(),
    countryCode: schema.string(),
    nationality: schema.string(),
    birthCountry: schema.string(),
    birthCity: schema.string(),
    // profilePic: schema.file.optional(),
    status: schema.enum.optional(['Incomplete', 'Verification_pending', 'Verified', 'Rejected']),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.driver')
}

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class DriverUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    firstNameEn: schema.string.optional(),
    middleNameEn: schema.string.optional(),
    lastNameEn: schema.string.optional(),
    firstNameAr: schema.string.optional(),
    middleNameAr: schema.string.optional(),
    lastNameAr: schema.string.optional(),
    nameOnCard: schema.string.optional([rules.minLength(2), rules.maxLength(19)]),
    gender: schema.enum.optional(['male', 'female', 'others']),
    dob: schema.string.optional([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    countryCode: schema.string.optional(),
    mobile: schema.string.optional(),
    birthCountry: schema.string.optional(),
    birthCity: schema.string.optional(),
    profilePic: schema.file.optional(),
    nationality: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.driver')
}

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class ProofOfIdentityValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    identificationType: schema.string.optional(),
    identificationNo: schema.string.optional([rules.maxLength(15)]),
    expiryDate: schema.string.optional([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    placeOfIssue: schema.string.optional(),
    passport: schema.boolean.optional(),
    passportNumber: schema.string.optional([rules.maxLength(9)]),
    passportIssueDate: schema.string.optional([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    passportExpiryDate: schema.string.optional([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    passportIssuePlace: schema.string.optional(),
    frontSide: schema.file.optional(),
    backSide: schema.file.optional(),
    passportFrontSide: schema.file.optional(),
    passportBackSide: schema.file.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.identity_proof')
}

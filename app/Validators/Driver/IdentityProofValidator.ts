import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class IdentityProofValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter
  public schema = schema.create({
    driverId: schema.string([rules.exists({ table: 'drivers', column: 'driver_uuid' })]),
    identificationType: schema.string(),
    identificationNo: schema.string([rules.maxLength(15)]),
    expiryDate: schema.string([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    placeOfIssue: schema.string.optional(),
    passport: schema.boolean(),
    passportNumber: schema.string([rules.maxLength(9)]),
    passportIssueDate: schema.string([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    passportExpiryDate: schema.string([rules.regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]),
    passportIssuePlace: schema.string(),
    frontSide: schema.file.optional(),
    backSide: schema.file.optional(),
    passportFrontSide: schema.file.optional(),
    passportBackSide: schema.file.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.identity_proof')
}

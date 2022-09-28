import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from '../User'
import Driver from 'App/Models/Driver/Driver'

import { v4 as uuid } from 'uuid'

export default class DriverIdentityProof extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public driverId: number

  @column()
  public identityProofUuid: string

  @column({ serializeAs: null })
  public createdBy: number

  @column({ serializeAs: null })
  public modifiedBy: number

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public audit: Array<object>

  @column()
  public status: string

  @column()
  public identificationNo: string

  @column()
  public identificationType: string

  @column()
  public expiryDate: string

  @column()
  public placeOfIssue: string

  @column()
  public frontSide: string

  @column()
  public backSide: string

  @column()
  public passport: boolean

  @column()
  public passportNumber: string

  @column()
  public passportIssueDate: string

  @column()
  public passportExpiryDate: string

  @column()
  public passportIssuePlace: string

  @column()
  public passportFrontSide: string

  @column()
  public passportBackSide: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public created_by: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'modifiedBy' })
  public modified_by: BelongsTo<typeof User>

  @belongsTo(() => Driver, { foreignKey: 'driverId' })
  public driver: BelongsTo<typeof Driver>

  @beforeCreate()
  public static assignUuid(DriverIdentityProof: DriverIdentityProof) {
    DriverIdentityProof.identityProofUuid = uuid()
  }
}

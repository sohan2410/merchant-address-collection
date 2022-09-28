import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from '../User'
import Driver from './Driver'

import { v4 as uuid } from 'uuid'
import Config from '../Config'

export default class DriverOtherDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public driverId: number

  @column()
  public otherDetailsUuid: string

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
  public usCitizenTaxpayer: boolean

  @column()
  public usGreenCardHolder: boolean

  @column()
  public relativesPoliticallyExposedPerson: boolean

  @column()
  public relationshipWithCustomer: number

  @column()
  public cardDeliveryLocation: number

  @column()
  public languageToCommunicate: number

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

  @belongsTo(() => Config, { foreignKey: 'relationshipWithCustomer' })
  public relationship_with_customer: BelongsTo<typeof Config>

  @belongsTo(() => Config, { foreignKey: 'languageToCommunicate' })
  public language_to_communicate: BelongsTo<typeof Config>

  @beforeCreate()
  public static assignUuid(DriverOtherDetail: DriverOtherDetail) {
    DriverOtherDetail.otherDetailsUuid = uuid()
  }
}

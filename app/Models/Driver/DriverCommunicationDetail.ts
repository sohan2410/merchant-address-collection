import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Functions from 'App/Services/Functions'
import File from 'App/Services/File'

import { v4 as uuid } from 'uuid'

import User from 'App/Models/User'
import Driver from 'App/Models/Driver/Driver'

export default class DriverCommunicationDetail extends compose(BaseModel, File, Functions) {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public commDetailsUuid: string

  @column({ serializeAs: null })
  public driverId: number

  @column({ serializeAs: null })
  public createdBy: number

  @column()
  public status: string

  @column()
  public streetName: string

  @column()
  public country: string

  @column()
  public countryIso: string

  @column()
  public city: string

  @column()
  public zipCode: number

  @column()
  public buildingNo: string

  @column({ serializeAs: null })
  public modifiedBy: number

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public audit: Array<object>

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
  public static assignUuid(DriverCommunicationDetail: DriverCommunicationDetail) {
    DriverCommunicationDetail.commDetailsUuid = uuid()
  }
}

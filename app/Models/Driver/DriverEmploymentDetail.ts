import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import { v4 as uuid } from 'uuid'

import User from 'App/Models/User'
import Driver from 'App/Models/Driver/Driver'
import Config from '../Config'

export default class DriverEmploymentDetail extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public employmentDetailsUuid: string

  @column({ serializeAs: null })
  public driverId: number

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
  public workStatus: string

  @column()
  public professionalLevel: string

  @column()
  public employerName: string

  @column()
  public workAddress: string

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

  @belongsTo(() => Config, { foreignKey: 'workStatus' })
  public work_status: BelongsTo<typeof Config>

  @belongsTo(() => Config, { foreignKey: 'professionalLevel' })
  public professional_level: BelongsTo<typeof Config>

  @beforeCreate()
  public static assignUuid(DriverEmploymentDetail: DriverEmploymentDetail) {
    DriverEmploymentDetail.employmentDetailsUuid = uuid()
  }
}

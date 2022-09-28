import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Functions from 'App/Services/Functions'
import File from 'App/Services/File'

import { v4 as uuid } from 'uuid'

import User from 'App/Models/User'
import DriverCommunicationDetail from 'App/Models/Driver/DriverCommunicationDetail'
import DriverEmploymentDetail from './DriverEmploymentDetail'
import DriverIdentityProof from './DriverIdentityProof'
import DriverOtherDetail from './DriverOtherDetail'

export default class Driver extends compose(BaseModel, File, Functions) {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public driverUuid: string

  @column({ serializeAs: null })
  public createdBy: number

  @column()
  public status: string

  @column()
  public firstNameEn: string

  @column()
  public middleNameEn: string

  @column()
  public lastNameEn: string

  @column()
  public firstNameAr: string

  @column()
  public middleNameAr: string

  @column()
  public lastNameAr: string

  @column()
  public nameOnCard: string

  @column()
  public gender: string

  @column()
  public dob: string

  @column()
  public countryCode: string

  @column()
  public mobile: string

  @column()
  public nationality: string

  @column()
  public birthCountry: string

  @column()
  public birthCity: string

  @column()
  public nationalityIso: string

  @column()
  public birthCountryIso: string

  @column()
  public profilePic: string

  @column({ serializeAs: null })
  public modifiedBy: string

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

  @hasOne(() => DriverCommunicationDetail)
  public communication_detail: HasOne<typeof DriverCommunicationDetail>

  @hasOne(() => DriverEmploymentDetail)
  public employment_detail: HasOne<typeof DriverEmploymentDetail>

  @hasOne(() => DriverIdentityProof)
  public proof_of_identity: HasOne<typeof DriverIdentityProof>

  @hasOne(() => DriverOtherDetail)
  public other_detail: HasOne<typeof DriverOtherDetail>

  @beforeCreate()
  public static assignUuid(driver: Driver) {
    driver.driverUuid = uuid()
  }
}

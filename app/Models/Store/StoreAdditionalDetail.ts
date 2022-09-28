import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Store from 'App/Models/Store/Store'

import { v4 as uuid } from 'uuid'

import Functions from 'App/Services/Functions'

export default class StoreAdditionalDetail extends compose(BaseModel, Functions) {
  // public static selfAssignPrimaryKey = true

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public storeAdditionalDetailId: string

  @column({ serializeAs: null })
  public storeId: string

  @column()
  public noOfSmartPhones: number

  @column()
  public noOfPosMachines: number

  @column()
  public noOfAttendants: number

  @column()
  public internetConnectivity: boolean

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public socialLinks: object

  @column()
  public comments: object

  @column()
  public status: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @beforeCreate()
  public static assignUuid(storeAdditionalDetail: StoreAdditionalDetail) {
    storeAdditionalDetail.storeAdditionalDetailId = uuid()
  }
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate, computed, afterFind } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Functions from 'App/Services/Functions'

import Store from 'App/Models/Store/Store'

import { v4 as uuid } from 'uuid'
export default class StorePersonnelDetail extends compose(BaseModel, Functions) {
  // public static selfAssignPrimaryKey = true

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public storePersonnelDetailId: string

  @column()
  public category: string

  @column()
  public name: string

  @column()
  public mobile: string

  @column()
  public countryCode: string

  @computed()
  public contactNo: string

  @column()
  public email: string

  @column({ serializeAs: null })
  storeId: string

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public metadata: object

  @column()
  public status: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @beforeCreate()
  public static assignUuid(storePersonnelDetail: StorePersonnelDetail) {
    storePersonnelDetail.storePersonnelDetailId = uuid()
  }

  @afterFind()
  public static async findContactNo(storePersonnelDetail: StorePersonnelDetail) {
    storePersonnelDetail.contactNo = storePersonnelDetail.countryCode + storePersonnelDetail.mobile
  }
}

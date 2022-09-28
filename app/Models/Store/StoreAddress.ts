import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Functions from 'App/Services/Functions'

import Store from 'App/Models/Store/Store'

import { v4 as uuid } from 'uuid'

export default class StoreAddress extends compose(BaseModel, Functions) {
  // public static selfAssignPrimaryKey = true

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public storeAddressId: string

  @column({ serializeAs: null })
  public storeId: string

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public googleLocation: object

  @column()
  public addressLine1: string

  @column()
  public addressLine2: string

  @column()
  public locality: string

  @column()
  public city: string

  @column()
  public region: string

  @column()
  public country: string

  @column()
  public noOfTollBoothsOnRoute: number

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
  public static assignUuid(storeAddress: StoreAddress) {
    storeAddress.storeAddressId = uuid()
  }
}

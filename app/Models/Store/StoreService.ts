import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Store from 'App/Models/Store/Store'
import Functions from 'App/Services/Functions'

import { v4 as uuid } from 'uuid'
export default class StoreService extends compose(BaseModel, Functions) {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public storeServiceId: string

  @column({ serializeAs: null })
  storeId: string

  @column()
  public category: string

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public serviceData: object

  @column()
  public status: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @beforeCreate()
  public static assignUuid(storeService: StoreService) {
    storeService.storeServiceId = uuid()
  }
}

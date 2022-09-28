import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

import { compose } from '@ioc:Adonis/Core/Helpers'

import Functions from 'App/Services/Functions'

import Store from 'App/Models/Store/Store'

import { v4 as uuid } from 'uuid'
export default class StoreContractDetail extends compose(BaseModel, Functions) {
  // public static selfAssignPrimaryKey = true

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public storeContractDetailId: string

  @column()
  public daysForOnboarding: string

  @column()
  public status: string

  @column()
  public startDate: Date

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public paymentTerms: string

  @column()
  public merchantDiscountRate: string

  @column({ serializeAs: null })
  public storeId: string

  @column()
  public contractStatus: string

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public metadata: object

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @beforeCreate()
  public static assignUuid(storeContractDetail: StoreContractDetail) {
    storeContractDetail.storeContractDetailId = uuid()
  }
}

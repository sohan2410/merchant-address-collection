import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, hasOne, HasOne, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Functions from 'App/Services/Functions'
import File from 'App/Services/File'

import { v4 as uuid } from 'uuid'

import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'

import User from 'App/Models/User'
import StoreAddress from 'App/Models/Store/StoreAddress'
import PersonnelDetail from 'App/Models/Store/StorePersonnelDetail'
import StoreContractDetail from 'App/Models/Store/StoreContractDetail'
import StoreAdditionalDetail from 'App/Models/Store/StoreAdditionalDetail'
import StoreService from 'App/Models/Store/StoreService'
import StoreImage from 'App/Models/Store/StoreImage'

import StoreFilter from 'App/Models/Filters/StoreFilter'
export default class Store extends compose(BaseModel, File, Functions, Filterable) {
  public static $filter = () => StoreFilter
  // public static selfAssignPrimaryKey = true

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public storeId: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public userId: string

  @attachment({
    folder: 'images/user',
    preComputeUrl: true,
  })
  public images?: AttachmentContract | null

  @attachment({
    folder: 'images/user',
    preComputeUrl: true,
  })
  public logo?: AttachmentContract | null

  @column()
  public storeCategory: string

  @column()
  public category: string //individual or company

  @column()
  public ownershipType: string // franchise or own or branch

  @column()
  public approachDate: Date

  @column({
    consume: (value) => (value ? JSON.parse(value) : value),
    prepare: (value) => (value ? JSON.stringify(value) : value),
  })
  public paymentModeAccepted: object

  @column()
  public openingTimings: string

  @column()
  public closingTimings: string

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

  @belongsTo(() => User) //userId
  public users: BelongsTo<typeof User>

  @hasMany(() => StoreImage)
  public storeImage: HasMany<typeof StoreImage>

  @hasOne(() => StoreAddress)
  public storeAddress: HasOne<typeof StoreAddress>

  @hasOne(() => StoreContractDetail)
  public storeContractDetail: HasOne<typeof StoreContractDetail>

  @hasMany(() => PersonnelDetail)
  public personnelDetail: HasMany<typeof PersonnelDetail>

  @hasMany(() => StoreService)
  public storeService: HasMany<typeof StoreService>

  @hasOne(() => StoreAdditionalDetail)
  public storeAdditionalDetail: HasOne<typeof StoreAdditionalDetail>

  @beforeCreate()
  public static assignUuid(store: Store) {
    store.storeId = uuid()
  }
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { compose } from '@ioc:Adonis/Core/Helpers'

import Functions from 'App/Services/Functions'
import File from 'App/Services/File'

import Store from 'App/Models/Store/Store'
import User from 'App/Models/User'

import { v4 as uuid } from 'uuid'

export default class StoreImage extends compose(BaseModel, File, Functions) {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public storeImageId: string

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public storeId: number

  @attachment({
    folder: 'images/user',
    preComputeUrl: true,
  })
  public image?: AttachmentContract | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @belongsTo(() => User) //userId
  public users: BelongsTo<typeof User>

  @beforeCreate()
  public static assignUuid(storeImage: StoreImage) {
    storeImage.storeImageId = uuid()
  }
}

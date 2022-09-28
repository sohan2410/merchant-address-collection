import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Config extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: string

  @column({ serializeAs: 'label' })
  public value: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StoreImages extends BaseSchema {
  protected tableName = 'store_images'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('store_image_id')
      table.json('image').nullable()
      table.integer('store_id').unsigned().references('id').inTable('stores').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('status').defaultTo('active')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

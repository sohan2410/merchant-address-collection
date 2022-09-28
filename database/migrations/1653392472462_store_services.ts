import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StoreServiceProvideds extends BaseSchema {
  protected tableName = 'store_services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('store_service_id')
      table.string('category')
      table.json('service_data').nullable()
      table.integer('store_id').unsigned().references('id').inTable('stores').onDelete('CASCADE')
      table.string('status').defaultTo('active')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

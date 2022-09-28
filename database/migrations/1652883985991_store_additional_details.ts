import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StoreAdditionalDetails extends BaseSchema {
  protected tableName = 'store_additional_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('store_additional_detail_id')
      table.integer('no_of_smart_phones')
      table.integer('no_of_pos_machines')
      table.integer('no_of_attendants')
      table.boolean('internet_connectivity').defaultTo(true)
      table.json('social_links')
      table.string('comments')
      table.integer('store_id').unsigned().references('id').inTable('stores').onDelete('CASCADE')
      table.string('status').defaultTo('active')
      table.json('metadata').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

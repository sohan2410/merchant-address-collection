import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StorePersonnelDetails extends BaseSchema {
  protected tableName = 'store_personnel_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('store_personnel_detail_id')
      table.string('category', 15)
      table.string('name', 30)
      table.string('mobile', 15).nullable()
      table.string('country_code', 20)
      table.string('email', 30).nullable()
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

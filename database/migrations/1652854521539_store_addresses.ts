import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StoreAddresses extends BaseSchema {
  protected tableName = 'store_addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('store_address_id')
      // table.uuid('id').primary().index()
      table.json('google_location').nullable()
      table.string('address_line1')
      table.string('address_line2')
      table.string('locality')
      table.string('city')
      table.string('region')
      table.string('country')
      table.integer('no_of_toll_booths_on_route')
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

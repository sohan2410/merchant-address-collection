import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StoreContractDetails extends BaseSchema {
  protected tableName = 'store_contract_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('store_contract_detail_id')
      // table.uuid('id').primary().index()
      table.integer('days_for_onboarding')
      table.string('contract_status', 255)
      table.string('status', 255).defaultTo('active')
      table.date('start_date')
      table.json('payment_terms')
      table.string('merchant_discount_rate', 64)
      table.integer('store_id').unsigned().references('id').inTable('stores').onDelete('CASCADE')
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

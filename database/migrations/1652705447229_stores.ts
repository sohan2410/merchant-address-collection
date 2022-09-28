import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stores extends BaseSchema {
  protected tableName = 'stores'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('store_id')
      table.string('name').notNullable()
      table.string('store_category')
      table.string('category')
      table.string('ownership_type')
      table.date('approach_date')
      table.json('payment_mode_accepted').nullable()
      table.string('opening_timings')
      table.string('closing_timings')
      table.string('status').defaultTo('active')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.json('metadata').nullable()
      table.json('logo').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

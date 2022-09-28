import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DriverOtherDetails extends BaseSchema {
  protected tableName = 'driver_other_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('other_details_uuid')
      table.integer('driver_id').unsigned().references('id').inTable('drivers').onDelete('CASCADE')
      table.integer('created_by').unsigned().references('id').inTable('users')
      table.string('status').defaultTo('active')
      table.boolean('us_citizen_taxpayer').notNullable()
      table.boolean('us_green_card_holder').notNullable()
      table.boolean('relatives_politically_exposed_person').notNullable()
      table.integer('relationship_with_customer').unsigned().references('id').inTable('configs').onDelete('CASCADE')
      table.string('card_delivery_location')
      table.integer('language_to_communicate').unsigned().references('id').inTable('configs').onDelete('CASCADE')
      table.integer('modified_by').unsigned().references('id').inTable('users')
      table.json('audit').defaultTo([])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

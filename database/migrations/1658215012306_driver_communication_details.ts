import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DriverCommunicationDetails extends BaseSchema {
  protected tableName = 'driver_communication_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('comm_details_uuid')
      table.integer('driver_id').unsigned().references('id').inTable('drivers').onDelete('CASCADE')
      table.integer('created_by').unsigned().references('id').inTable('users')
      table.string('status').defaultTo('active')
      table.string('street_name', 40)
      table.string('country')
      table.string('country_iso')
      table.string('city')
      table.string('zip_code', 8)
      table.string('building_no', 6)
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

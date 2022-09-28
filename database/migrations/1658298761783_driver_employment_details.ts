import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DriverEmploymentDetails extends BaseSchema {
  protected tableName = 'driver_employment_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('employment_details_uuid')
      table.integer('driver_id').unsigned().references('id').inTable('drivers').onDelete('CASCADE')
      table.integer('created_by').unsigned().references('id').inTable('users')
      table.string('status').defaultTo('active')
      table.integer('work_status').unsigned().references('id').inTable('configs').onDelete('CASCADE')
      table.integer('professional_level').unsigned().references('id').inTable('configs').onDelete('CASCADE')
      table.string('employer_name')
      table.string('work_address')
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

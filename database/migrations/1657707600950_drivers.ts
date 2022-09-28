import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Drivers extends BaseSchema {
  protected tableName = 'drivers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('driver_uuid')
      table.integer('created_by').unsigned().references('id').inTable('users')
      table.string('status').defaultTo('Incomplete')
      table.string('first_name_en')
      table.string('middle_name_en')
      table.string('last_name_en')
      table.string('first_name_ar')
      table.string('middle_name_ar')
      table.string('last_name_ar')
      table.string('name_on_card', 19)
      table.string('gender')
      table.string('dob')
      table.string('country_code')
      table.string('mobile')
      table.string('nationality')
      table.string('birth_country')
      table.string('birth_city')
      table.string('nationality_iso')
      table.string('birth_country_iso')
      table.string('profile_pic')
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

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DriverIdentityProofs extends BaseSchema {
  protected tableName = 'driver_identity_proofs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('identity_proof_uuid')
      table.integer('driver_id').unsigned().references('id').inTable('drivers').onDelete('CASCADE')
      table.integer('created_by').unsigned().references('id').inTable('users')
      table.string('status').defaultTo('active')
      table.string('identification_type')
      table.string('identification_no')
      table.string('expiry_date')
      table.string('place_of_issue')
      table.string('front_side')
      table.string('back_side')
      table.boolean('passport')
      table.string('passport_number')
      table.string('passport_issue_date')
      table.string('passport_expiry_date')
      table.string('passport_issue_place')
      table.string('passport_front_side')
      table.string('passport_back_side')
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

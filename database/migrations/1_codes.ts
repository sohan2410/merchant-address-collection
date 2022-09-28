import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Codes extends BaseSchema {
  protected tableName = 'codes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.string('identifier', 100).unique()
      table.string('otp', 10).unique()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

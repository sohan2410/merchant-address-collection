import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Configs extends BaseSchema {
  protected tableName = 'configs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key')
      table.string('value')
      table.string('status').defaultTo('active')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

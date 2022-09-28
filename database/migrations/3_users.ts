import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('user_id')
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('first_name', 45)
      table.string('last_name', 45)
      table.date('dob')
      table.integer('country_code', 3)
      table.string('country')
      table.bigInteger('mobile').unique()
      table.json('image').nullable()
      table.string('status', 15).defaultTo('active')
      table.string('gender', 10)
      table.boolean('first_login').defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    await Role.updateOrCreate(
      { slug: 'admin' },
      { slug: 'admin', name: 'Admin', description: 'Master Admin Role' }
    )
    await Role.updateOrCreate(
      { slug: 'sub-admin' },
      { slug: 'sub-admin', name: 'Sub Admin', description: 'Admin Role but cannot add admin' }
    )

    await Role.updateOrCreate({ slug: 'user' }, { slug: 'user', name: 'User', description: 'User' })
  }
}

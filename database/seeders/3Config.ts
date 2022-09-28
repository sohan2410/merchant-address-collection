import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Config from 'App/Models/Config'

export default class ConfigSeeder extends BaseSeeder {
  public async run() {
    await Config.updateOrCreate({ id: 1 }, { key: 'workStatus', value: 'Employed' })
    await Config.updateOrCreate({ id: 2 }, { key: 'workStatus', value: 'Unemployed' })
    await Config.updateOrCreate({ id: 3 }, { key: 'professionalLevel', value: 'Entry-Level' })
    await Config.updateOrCreate({ id: 4 }, { key: 'professionalLevel', value: 'Intermediate' })
    await Config.updateOrCreate({ id: 5 }, { key: 'professionalLevel', value: 'Mid-Level' })
    await Config.updateOrCreate({ id: 6 }, { key: 'professionalLevel', value: 'Senior' })
    await Config.updateOrCreate({ id: 7 }, { key: 'professionalLevel', value: 'Executive-Level' })
    await Config.updateOrCreate({ id: 8 }, { key: 'professionalLevel', value: 'Other' })
    await Config.updateOrCreate({ id: 9 }, { key: 'relationshipWithCustomer', value: 'Domestic PEPs' })
    await Config.updateOrCreate({ id: 10 }, { key: 'relationshipWithCustomer', value: 'Foreign PEPs' })
    await Config.updateOrCreate({ id: 11 }, { key: 'relationshipWithCustomer', value: 'International PEPs' })
    await Config.updateOrCreate({ id: 12 }, { key: 'relationshipWithCustomer', value: 'Family members' })
    await Config.updateOrCreate({ id: 13 }, { key: 'relationshipWithCustomer', value: 'Close associates' })
    await Config.updateOrCreate({ id: 14 }, { key: 'languageToCommunicate', value: 'Arabic' })
    await Config.updateOrCreate({ id: 15 }, { key: 'languageToCommunicate', value: 'English' })
    await Config.updateOrCreate({ id: 16 }, { key: 'languageToCommunicate', value: 'Hindi' })
    await Config.updateOrCreate({ id: 17 }, { key: 'languageToCommunicate', value: 'Urdu' })
  }
}

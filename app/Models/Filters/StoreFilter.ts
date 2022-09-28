import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Store from 'App/Models/Store/Store'

export default class StoreFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Store, Store>
  // public static camelCase: boolean = true

  category(category: string) {
    this.$query.where('category', category)
  }

  country(country: string) {
    this.$query.where((query) =>
      query
        .whereHas('storeAddress', (query) => query.where((q) => q.whereNull('country').orWhere('country', country)))
        .orWhere('status', 'draft')
        .orWhere('status', 'draft')
        .orDoesntHave('storeAddress')
    )
  }

  status(status: string) {
    this.$query.where('status', status)
  }

  name(name: string) {
    this.$query.where('name', 'LIKE', `${name}%`)
  }

  user(id: string) {
    this.$query.whereHas('users', (query) => query.where('userId', id))
  }

  email(email: string) {
    this.$query.whereHas('users', (query) => query.where('email', email))
  }

  storeCategory(category: string) {
    this.$query.where('storeCategory', category)
  }

  approachdateGte(date: Date) {
    this.$query.where('approachDate', '>=', date)
  }
  approachdateGt(date: Date) {
    this.$query.where('approachDate', '>', date)
  }
  approachdateLte(date: Date) {
    this.$query.where('approachDate', '<=', date)
  }
  approachdateLt(date: Date) {
    this.$query.where('approachDate', '<', date)
  }

  region(region: string) {
    this.$query.whereHas('storeAddress', (query) => query.where('region', region))
  }
}

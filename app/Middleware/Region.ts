import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Store from 'App/Models/Store/Store'

export default class Region {
  public async handle({ params, auth, response }: HttpContextContract, next: () => Promise<void>) {
    const userCountry = auth.user?.country
    const { id } = params
    const store = await Store.findBy('storeId', id)
    if (!store) return Store.getResponse(0, 'store.notFound')
    await store.load('storeAddress')
    if (auth.user?.roles.slug === 'admin' || store.status !== 'active' || !store.storeAddress || userCountry?.toUpperCase() === store.storeAddress?.country?.toUpperCase()) await next()
    else response.status(200).send(Store.getResponse(0, 'auth.regionUnauthorized'))
  } //store.status !== 'active' ||
}

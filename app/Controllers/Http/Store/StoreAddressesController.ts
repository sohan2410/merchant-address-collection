// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Store from 'App/Models/Store/Store'
import StoreAddress from 'App/Models/Store/StoreAddress'
import { checkRegion } from 'App/Services/Region'
import AddressValidator from 'App/Validators/Store/AddressValidator'
export default class StoreAddressesController {
  public async index({ request }) {
    const page = request.input('page', 1)
    const limit = request.input('page_size', 10)

    const stores = await Database.from('store_addresses').paginate(page, limit)
    return StoreAddress.getResponse(1, 'store.address.found', stores)
  }

  public async show({ auth, params }) {
    const { id } = params
    const storeAddress = await StoreAddress.findBy('storeAddressId', id)
    if (!storeAddress) return StoreAddress.getResponse(0, 'store.notFound')
    await storeAddress?.load('store')
    if (await checkRegion(auth, storeAddress.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    return StoreAddress.getResponse(1, 'store.address.found', storeAddress)
  }

  public async store({ auth, request }) {
    const data = await request.validate(AddressValidator)
    const { storeId } = request.all()
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    data.storeId = store.id
    if (await checkRegion(auth, store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    if (await StoreAddress.findBy('storeId', store.id)) return Store.getResponse(0, 'store.address.alreadyExists')
    const storeAddress = await StoreAddress.create(data)
    await storeAddress.load('store')
    return StoreAddress.getResponse(1, 'store.address.created', storeAddress)
  }

  public async update({ auth, request, params }) {
    const { id } = params
    const data = await request.validate(AddressValidator)
    const store = await StoreAddress.findBy('storeAddressId', id)
    if (!store) return StoreAddress.getResponse(0, 'store.notFound')
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    store.merge(data)
    await store.save()
    return StoreAddress.getResponse(1, 'store.address.updated', store)
  }

  public async destroy({ auth, params }) {
    const { id } = params
    const store = await StoreAddress.findBy('storeAddressId', id)
    if (!store) return StoreAddress.getResponse(0, 'store.address.notFound')
    store.status = 'deleted'
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    await store.save()
    return StoreAddress.getResponse(1, 'store.address.deleted')
  }
}

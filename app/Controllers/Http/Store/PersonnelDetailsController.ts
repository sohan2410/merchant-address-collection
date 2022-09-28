// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Store from 'App/Models/Store/Store'
import StorePersonnelDetail from 'App/Models/Store/StorePersonnelDetail'
import { checkRegion } from 'App/Services/Region'
import PersonnelDetailValidator from 'App/Validators/Store/PersonnelDetailValidator'

export default class PersonnelDetailsController {
  public required = ['category', 'name', 'contactNo', 'email', 'metada', 'storeId']

  public async index({ request }) {
    const page = request.input('page', 1)
    const limit = request.input('page_size', 10)

    const stores = await Database.from('store_personnel_details').paginate(page, limit)
    return StorePersonnelDetail.getResponse(1, 'store.personnel_details.found', stores)
  }

  public async show({ auth, params }) {
    const { id } = params
    const storePersonnelDetails = await StorePersonnelDetail.findBy('store_personnel_detail_id', id)
    if (!storePersonnelDetails) return StorePersonnelDetail.getResponse(0, 'store.personnel_details.not_found')
    await storePersonnelDetails.load('store')
    if (await checkRegion(auth, storePersonnelDetails.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    return StorePersonnelDetail.getResponse(1, 'store.personnel_details.found', { storePersonnelDetails, category: storePersonnelDetails.category })
  }

  public async store({ auth, request }) {
    let { storeId, category } = request.all()
    const data = await request.validate(PersonnelDetailValidator)
    if (!data.email && !data.mobile) return Store.getResponse(0, 'store.personnel_details.eitherField')
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    data.storeId = store.id
    if (await checkRegion(auth, store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    category = category.charAt(0).toUpperCase() + category.slice(1)
    data.category = category
    const personnelDetails = await StorePersonnelDetail.create(data)
    await personnelDetails.load('store')
    return StorePersonnelDetail.getResponse(1, 'store.personnel_details.created', { personnelDetails, category })
  }

  public async update({ auth, request, params }) {
    const data = await request.validate(PersonnelDetailValidator)
    const store = await StorePersonnelDetail.findBy('store_personnel_detail_id', params.id)
    if (!store) return StorePersonnelDetail.getResponse(0, 'store.personnel_details.notFound')
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    store.merge(data)
    await store.save()
    return StorePersonnelDetail.getResponse(1, 'store.personnel_details.updated', { store, category: store.category })
  }

  public async destroy({ auth, params }) {
    const { id } = params
    const store = await StorePersonnelDetail.findBy('store_personnel_detail_id', id)
    if (!store) return StorePersonnelDetail.getResponse(0, 'store.personnel_details.notFound')
    store.status = 'deleted'
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    await store.save()
    return StorePersonnelDetail.getResponse(1, 'store.personnel_details.deleted', { category: store.category })
  }
}

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Store from 'App/Models/Store/Store'
import StoreAdditionalDetail from 'App/Models/Store/StoreAdditionalDetail'
import StoreService from 'App/Models/Store/StoreService'
import { checkRegion } from 'App/Services/Region'
import StoreAdditionalDetailValidator from 'App/Validators/Store/StoreAdditionalDetailValidator'

export default class AdditionalDetailsController {
  public async index({ request }) {
    const page = request.input('page', 1)
    const limit = request.input('page_size', 10)

    const stores = await Database.from('store_additional_details').paginate(page, limit)
    return StoreAdditionalDetail.getResponse(1, 'store.additional_details.found', stores)
  }

  public async show({ auth, params }) {
    const { id } = params
    const store = await StoreAdditionalDetail.findBy('store_additional_detail_id', id)

    if (await checkRegion(auth, store?.storeId)) return StoreService.getResponse(0, 'auth.regionUnauthorized')

    if (!store) return StoreAdditionalDetail.getResponse(0, 'store.additional_details.notFound')
    return StoreAdditionalDetail.getResponse(1, 'store.additional_details.found', store)
  }

  public async store({ auth, request }) {
    const { storeId } = request.all()
    const data = await request.validate(StoreAdditionalDetailValidator)
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    data.storeId = store.id

    if (await checkRegion(auth, store.id)) {
      return Store.getResponse(0, 'auth.regionUnauthorized')
    }

    store.status = 'active'
    await store.save()
    if (await StoreAdditionalDetail.findBy('storeId', store.id)) return Store.getResponse(0, 'store.additional_details.alreadyExists')
    const additionDetails = await StoreAdditionalDetail.create(data)
    await additionDetails.load('store')
    return StoreAdditionalDetail.getResponse(1, 'store.additional_details.created', additionDetails)
  }

  public async update({ auth, request, params }) {
    const data = await request.validate(StoreAdditionalDetailValidator)
    const storeAdditionalDetail = await StoreAdditionalDetail.findBy('store_additional_detail_id', params.id)
    if (!storeAdditionalDetail) return StoreAdditionalDetail.getResponse(0, 'store.additional_details.notFound')
    storeAdditionalDetail.merge(data)
    await storeAdditionalDetail.load('store')
    if (await checkRegion(auth, storeAdditionalDetail.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    await storeAdditionalDetail.save()
    const store = await Store.find(storeAdditionalDetail.storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    store.status = 'active'
    await store?.save()

    return StoreAdditionalDetail.getResponse(1, 'store.additional_details.updated', storeAdditionalDetail)
  }

  public async destroy({ auth, params }) {
    const { id } = params
    const store = await StoreAdditionalDetail.findBy('store_additional_detail_id', id)
    if (!store) return StoreAdditionalDetail.getResponse(0, 'store.additional_details.notFound')
    store.status = 'deleted'
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    await store.save()
    return StoreAdditionalDetail.getResponse(1, 'store.additional_details.deleted')
  }
}

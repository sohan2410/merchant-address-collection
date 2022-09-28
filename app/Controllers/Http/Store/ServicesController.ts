// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Store from 'App/Models/Store/Store'
import StoreService from 'App/Models/Store/StoreService'
import { checkRegion } from 'App/Services/Region'
import ServiceValidator from 'App/Validators/Store/ServiceValidator'

export default class ServicesController {
  public async index({ request }) {
    const page = request.input('page', 1)
    const limit = request.input('page_size', 10)
    const status = request.input('status', 'active')
    let storeServices = await StoreService.query().where('status', 'LIKE', `${status}%`).paginate(page, limit)
    return StoreService.getResponse(1, 'store.service.found', storeServices)
  }

  public async show({ auth, params }) {
    const { id } = params
    const store = await StoreService.findBy('storeServiceId', id)
    if (!store) return StoreService.getResponse(0, 'store.notFound')
    await store?.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    return StoreService.getResponse(1, 'store.service.found', store)
  }

  public async store({ auth, request }) {
    const { storeId } = request.all()
    const data = await request.validate(ServiceValidator)
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    data.storeId = store.id
    if (await checkRegion(auth, store.id)) return Store.getResponse(4, 'auth.regionUnauthorized')
    let already_exists_store_service = await StoreService.findBy('storeId', store.id)
    if (already_exists_store_service) {
      already_exists_store_service.category = data.category
      already_exists_store_service.serviceData = data.serviceData
      await already_exists_store_service.save()
      return StoreService.getResponse(1, 'store.service.updated', already_exists_store_service)
    }
    const storeService = await StoreService.create(data)
    return StoreService.getResponse(1, 'store.service.created', storeService)
  }

  public async update({ auth, request, params }) {
    const data = await request.validate(ServiceValidator)
    const storeService = await StoreService.findBy('storeServiceId', params.id)
    if (!storeService) return StoreService.getResponse(0, 'store.service.notFound')
    await storeService.load('store')
    if (await checkRegion(auth, storeService.store.id)) return Store.getResponse(4, 'auth.regionUnauthorized')
    storeService.category = data.category
    storeService.serviceData = data.serviceData
    await storeService.save()
    return StoreService.getResponse(1, 'store.service.updated', storeService)
  }

  public async destroy({ auth, params }) {
    const { id } = params
    const store = await StoreService.findBy('storeServiceId', id)
    if (!store) return StoreService.getResponse(0, 'store.service.notFound')
    store.status = 'deleted'
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    await store.save()
    return StoreService.getResponse(1, 'store.service.deleted')
  }
}

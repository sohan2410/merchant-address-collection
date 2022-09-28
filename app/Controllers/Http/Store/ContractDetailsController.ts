// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Store from 'App/Models/Store/Store'
import StoreContractDetail from 'App/Models/Store/StoreContractDetail'
import { checkRegion } from 'App/Services/Region'
import ContractDetailValidator from 'App/Validators/Store/ContractDetailValidator'

export default class ContractDetailsController {
  public required = ['daysForOnboarding', 'status', 'startDate', 'paymentTerms', 'merchantDiscountRate', 'storeId']

  public async index({ request }) {
    const page = request.input('page', 1)
    const limit = request.input('page_size', 10)

    const stores = await Database.from('store_contract_details').paginate(page, limit)

    return StoreContractDetail.getResponse(1, 'store.contract_details.found', stores)
  }

  public async show({ auth, params }) {
    const { id } = params
    const store = await StoreContractDetail.findBy('store_contract_detail_id', id)
    if (!store) return StoreContractDetail.getResponse(0, 'store.contract_details.notFound')
    await store.load('store')
    if (await checkRegion(auth, store?.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')

    return StoreContractDetail.getResponse(1, 'store.contract_details.found', store)
  }

  public async store({ auth, request }) {
    const { storeId } = request.all()
    const data = await request.validate(ContractDetailValidator)
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    data.storeId = store.id
    if (await checkRegion(auth, store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    if (await StoreContractDetail.findBy('storeId', store.id)) return Store.getResponse(0, 'store.contract_details.alreadyExists')
    const contractDetails = await StoreContractDetail.create(data)
    await contractDetails.load('store')
    return StoreContractDetail.getResponse(1, 'store.contract_details.created', contractDetails)
  }

  public async update({ auth, request, params }) {
    const data = await request.validate(ContractDetailValidator)
    const store = await StoreContractDetail.findBy('store_contract_detail_id', params.id)
    if (!store) return StoreContractDetail.getResponse(0, 'store.contract_details.notFound')
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    store.merge(data)
    await store.save()
    return StoreContractDetail.getResponse(1, 'store.contract_details.updated', store)
  }

  public async destroy({ auth, params }) {
    const { id } = params
    const store = await StoreContractDetail.findBy('store_contract_detail_id', id)
    if (!store) return StoreContractDetail.getResponse(0, 'store.contract_details.notFound')
    store.status = 'deleted'
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    await store.save()
    return StoreContractDetail.getResponse(1, 'store.contract_details.deleted')
  }
}

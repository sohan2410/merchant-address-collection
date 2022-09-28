// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Store from 'App/Models/Store/Store'
import StoreImage from 'App/Models/Store/StoreImage'
import ActivateValidator from 'App/Validators/Store/ActivateValidator'
import StoreFilterValidator from 'App/Validators/Store/StoreFilterValidator'
import StoreUpdateValidator from 'App/Validators/Store/StoreUpdateValidator'
import StoreValidator from 'App/Validators/Store/StoreValidator'

export default class StoresController {
  public async index({ request, auth }) {
    if (auth.user?.roles.slug === 'user') request.requestData.country = auth.user?.country
    await request.validate(StoreFilterValidator)
    const page = request.input('page', 1)
    const limit = request.input('page_size', 10)

    let stores = Store.query()
    const data = await stores
      .preload('users', (user) => user.select('userId', 'firstName', 'lastName', 'email', 'country', 'mobile', 'roleId').preload('roles', (role) => role.select('description')))
      .orderBy('createdAt', 'desc')
      .filter(request.all())
      .paginate(page, limit)

    if (data.hasTotal) return Store.getResponse(1, 'store.found', data)
    return Store.getResponse(0, 'store.notFound', data)
  }

  public async show({ params }) {
    const { id } = params
    const store = await Store.findBy('storeId', id)
    if (!store) return Store.getResponse(0, 'store.notFound')
    await store?.load((loader) =>
      loader
        .load('users', (user) => user.select('userId', 'firstName', 'lastName', 'email', 'country', 'mobile', 'roleId').preload('roles', (role) => role.select('description')))
        .load('storeAddress')
        .load('personnelDetail')
        .load('storeContractDetail')
        .load('storeAdditionalDetail')
        .load('storeService')
        .load('storeImage')
    )
    return Store.getResponse(1, 'store.found', store)
  }

  public async store({ request, auth }) {
    const { paymentModeAccepted } = request.all()
    if (paymentModeAccepted) request.requestData.paymentModeAccepted = typeof paymentModeAccepted === 'object' ? paymentModeAccepted : JSON.parse(paymentModeAccepted)
    const payment = request.requestData.paymentModeAccepted
    let payment_check = Object.keys(payment).filter((v) => payment[v])
    if (payment_check.length || payment.others.length) {
      const data = await request.validate(StoreValidator)
      if (data.openingTimings > data.closingTimings) return Store.getResponse(0, 'store.incorrectStoreTimings')
      delete data['logo']
      // if (request.files('images').length === 0) return Store.getResponse(0, 'validation.store.images.required')
      data.userId = auth.user.id
      const store = await Store.create(data)
      if (request.files('images')) {
        const images = await StoreImage.filesUpload(request, 'images')
        if (!images || !images.error || !images.data) return Store.getResponse(0, 'auth.provideValidImage')
        for (var i = 0; i < images.data.length; i++) {
          await StoreImage.create({
            image: images.data[i],
            storeId: store.id,
            userId: auth.user.id,
          })
        }
      }
      if (request.file('logo')) {
        const image = await Store.fileUpload(request, 'logo', 1, ['jpg', 'jpeg', 'gif', 'png', 'svg', 'jfif'])
        if (!image || !image.error || !image.data) return Store.getResponse(0, 'auth.provideVaildLogo')
        store.logo = image.data
      }
      await store.save()
      await store?.load((loader) => loader.load('users', (user) => user.select('userId', 'firstName', 'lastName', 'email', 'country', 'mobile', 'roleId').preload('roles', (role) => role.select('description'))).load('storeImage'))
      return Store.getResponse(1, 'store.created', store)
    } else {
      return Store.getResponse(0, 'store.paymentValidate')
    }
  }

  public async update({ request, params }) {
    const { paymentModeAccepted } = request.all()
    if (paymentModeAccepted) request.requestData.paymentModeAccepted = JSON.parse(paymentModeAccepted)
    const payment = request.requestData.paymentModeAccepted
    let payment_check = Object.keys(payment).filter((v) => payment[v])
    if (payment_check.length || payment.others?.length) {
      const data = await request.validate(StoreUpdateValidator)
      const store = await Store.findBy('storeId', params.id)

      if (!store) return Store.getResponse(0, 'store.notFound')
      await store.load('storeImage')

      // If the store logo is not available and there is no store logo in request body
      // if (store.logo === null && request.file('logo') === null) return Store.getResponse(0, 'validation.store.logo.required')

      // If there are no store images of the store
      // if (store.storeImage.length === 0) return Store.getResponse(0, 'validation.store.images.required')

      if (request.file('logo')) {
        const image = await Store.fileUpload(request, 'logo', 1, ['jpg', 'jpeg', 'gif', 'png', 'svg', 'jfif'])
        if (!image || !image.error || !image.data) return Store.getResponse(0, 'auth.provideVaildLogo')
        store.logo = image.data
      } else {
        store.logo = null
      }
      store.merge(data)
      await store.save()
      await store.load('users', (user) => user.select('userId', 'firstName', 'lastName', 'email', 'country', 'mobile', 'roleId'))
      return Store.getResponse(1, 'store.updated', store)
    } else {
      return Store.getResponse(0, 'store.paymentValidate')
    }
  }

  public async destroy({ params }) {
    const { id } = params
    const store = await Store.findBy('storeId', id)
    if (!store) return Store.getResponse(0, 'store.notFound')
    store.status = 'deleted'
    await store.save()
    return Store.getResponse(1, 'store.deleted')
  }

  public async deactivateStore({ request }) {
    await request.validate(ActivateValidator)
    const { storeId } = request.all()
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    if (store.status === 'inactive') return Store.getResponse(0, 'store.alreadyInActive')
    store.status = 'inactive'
    await store.save()
    return Store.getResponse(1, 'store.statusUpdated')
  }

  public async activateStore({ request }) {
    await request.validate(ActivateValidator)
    const { storeId } = request.all()
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    if (store.status === 'active') return Store.getResponse(0, 'store.alreadyActive')
    store.status = 'active'
    await store.save()
    return Store.getResponse(1, 'store.statusUpdated')
  }
}

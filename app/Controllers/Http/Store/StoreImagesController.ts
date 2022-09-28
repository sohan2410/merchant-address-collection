// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Store from 'App/Models/Store/Store'
import StoreImage from 'App/Models/Store/StoreImage'
import { checkRegion } from 'App/Services/Region'
import ImageValidator from 'App/Validators/Store/ImageValidator'

export default class StoreImagesController {
  public async index({ request }) {
    const id = request.input('id')
    const storeImages = await Database.from('store_images').where('store_id', id)
    if (storeImages.length === 0) return StoreImage.getResponse(0, 'store.images.notFound')
    return StoreImage.getResponse(1, 'store.images.found', storeImages)
  }
  public async show({ auth, params }) {
    const { id } = params
    const store = await Store.findBy('storeId', id)
    if (!store) return Store.getResponse(0, 'store.notFound')

    if (await checkRegion(auth, store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')

    const images = await StoreImage.query()
      .where('store_id', store.id)
      .preload('store')
      .preload('users', (user) => user.select('userId', 'firstName', 'lastName', 'email', 'country', 'mobile', 'roleId'))

    if (images.length === 0) return StoreImage.getResponse(0, 'store.images.notFound')
    return StoreImage.getResponse(1, 'store.images.found', images)
  }
  public async store({ request, auth }) {
    await request.validate(ImageValidator)
    const { storeId } = request.all()
    const store = await Store.findBy('storeId', storeId)
    if (!store) return Store.getResponse(0, 'store.notFound')
    if (await checkRegion(auth, store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    if (request.files('images')) {
      const url: Array<object> = []
      const images = await StoreImage.filesUpload(request, 'images')
      if (!images || !images.error || !images.data) return StoreImage.getResponse(0, 'auth.provideValidImage')
      for (var i = 0; i < images.data.length; i++) {
        const image = await StoreImage.create({ image: images.data[i], storeId: store.id, userId: auth.user.id })
        url.push(image)
      }
      return StoreImage.getResponse(1, 'store.images.created', url)
    } else {
      return StoreImage.getResponse(0, 'auth.providImage')
    }
  }
  public async update({ auth, request, params }) {
    const { id } = params
    const store = await StoreImage.findBy('storeImageId', id)
    if (!store) return StoreImage.getResponse(0, 'store.images.notFound')

    await store.load('store')

    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')

    if (request.file('image')) {
      let image = await StoreImage.fileUpload(request, 'image', 1, ['jpg', 'jpeg', 'png', 'svg', 'jfif'])

      if (!image || !image.error) return (image && image) || StoreImage.getResponse(0, 'auth.provideValidImage')

      if (image.data) store.image = image.data

      await store.save()

      return StoreImage.getResponse(1, 'store.images.updated', store)
    } else {
      return StoreImage.getResponse(0, 'auth.provideImage')
    }
  }
  public async destroy({ auth, params }) {
    const { id } = params
    const store = await StoreImage.findBy('storeImageId', id)
    if (!store) return StoreImage.getResponse(0, 'store.images.notFound')
    await store.load('store')
    if (await checkRegion(auth, store.store.id)) return Store.getResponse(0, 'auth.regionUnauthorized')
    await store.delete()
    return StoreImage.getResponse(1, 'store.images.deleted')
  }
}

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Driver from 'App/Models/Driver/Driver'
import DriverOtherDetail from 'App/Models/Driver/DriverOtherDetail'
import OtherDetailValidator from 'App/Validators/Driver/OtherDetailValidator'
import OtherValidator from 'App/Validators/Driver/Update/OtherValidator'

export default class OtherDetailsController {
  public async show({ request, params }) {
    let { audit } = request.qs()
    audit = audit === 'true' ? true : false
    const data = await Driver.findBy('driverUuid', params.id)
    if (!data) return Driver.getResponse(0, 'driver.otherDetails.notFound')
    await data.load('other_detail', (q) => q.preload('relationship_with_customer').preload('language_to_communicate'))
    const result = data.other_detail.serialize(!audit ? { fields: { omit: ['audit'] } } : {})
    if (data?.other_detail) return Driver.getResponse(1, 'driver.otherDetails.found', result)
  }
  public async store({ auth, request }) {
    const { driverId } = request.all()
    const data = await request.validate(OtherDetailValidator)
    const driver = await Driver.findBy('driverUuid', driverId)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    if (await DriverOtherDetail.findBy('driverId', driver.id)) return Driver.getResponse(0, 'driver.otherDetails.alreadyExists')
    data.driverId = driver.id
    if (!data.relativesPoliticallyExposedPerson) data.relationshipWithCustomer = null
    const otherDetails = await DriverOtherDetail.create(data)
    otherDetails.createdBy = auth.user.id
    otherDetails.modifiedBy = auth.user.id
    await otherDetails.save()
    return Driver.getResponse(1, 'driver.otherDetails.created', otherDetails)
  }
  public async update({ request, params, auth }) {
    const driver = await Driver.findBy('driverUuid', params.id)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    await driver.load('other_detail')
    if (!driver.other_detail) return Driver.getResponse(0, 'driver.otherDetails.notFound')
    const otherDetails = driver.other_detail
    const data = await request.validate(OtherValidator)
    if (data.relativesPoliticallyExposedPerson === false) data.relationshipWithCustomer = null
    otherDetails.merge(data)
    const changed = Object.keys(data)
    const fields: object[] = []
    for (const key in otherDetails.$original) {
      if (changed.includes(key)) {
        fields.push({ field: key, value: otherDetails.$original[key] })
      }
    }
    otherDetails.audit.push({ udpatedAt: new Date().toISOString(), modifiedBy: auth.user.userId, fields })
    await otherDetails.save()
    return Driver.getResponse(1, 'driver.otherDetails.updated', otherDetails)
  }
}

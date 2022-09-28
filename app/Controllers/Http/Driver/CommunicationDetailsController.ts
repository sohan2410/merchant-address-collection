// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { countryToAlpha3 } from 'country-to-iso'

import DriverCommunicationDetail from 'App/Models/Driver/DriverCommunicationDetail'
import CommunicationDetailValidator from 'App/Validators/Driver/CommunicationDetailValidator'
import Driver from 'App/Models/Driver/Driver'
import CommunicationValidator from 'App/Validators/Driver/Update/CommunicationValidator'

export default class CommunicationDetailsController {
  public async show({ request, params }) {
    let { audit } = request.qs()
    audit = audit === 'true' ? true : false
    const data = await Driver.findBy('driverUuid', params.id)
    if (!data) return Driver.getResponse(0, 'driver.commDetails.notFound')
    await data?.load('communication_detail')
    // if (data?.communication_detail.status === 'deleted') return Driver.getResponse(0, 'driver.commDetails.commDetailsDeleted')
    const result = data?.communication_detail.serialize(!audit ? { fields: { omit: ['audit'] } } : {})
    if (data?.communication_detail) return Driver.getResponse(1, 'driver.commDetails.found', result)
  }
  public async store({ request, auth }) {
    const { driverId } = request.all()
    const data = await request.validate(CommunicationDetailValidator)
    const driver = await Driver.findBy('driverUuid', driverId)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    if (await DriverCommunicationDetail.findBy('driverId', driver.id)) return Driver.getResponse(0, 'driver.commDetails.alreadyExists')
    data.driverId = driver.id
    const commDetails = await DriverCommunicationDetail.create(data)
    commDetails.countryIso = countryToAlpha3(data.country)
    commDetails.createdBy = auth.user.id
    commDetails.modifiedBy = auth.user.id
    await commDetails.save()
    return Driver.getResponse(1, 'driver.commDetails.created', commDetails)
  }
  public async update({ request, params, auth }) {
    const driver = await Driver.findBy('driverUuid', params.id)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    await driver.load('communication_detail')
    if (!driver.communication_detail) return Driver.getResponse(0, 'driver.commDetails.notFound')
    const commDetails = driver.communication_detail
    const data = await request.validate(CommunicationValidator)
    if (data.country) data.countryIso = countryToAlpha3(data.country)
    commDetails.merge(data)
    const changed = Object.keys(data)
    let fields: object[] = []
    for (const key in commDetails.$original) {
      if (changed.includes(key)) {
        fields.push({ field: key, value: commDetails?.$original[key] })
      }
    }
    commDetails.audit.push({ udpatedAt: new Date().toISOString(), modifiedBy: auth.user.userId, fields })
    await commDetails.save()
    return Driver.getResponse(1, 'driver.commDetails.updated', commDetails)
  }
  public async destroy({ params }) {
    const data = await Driver.findBy('driverUuid', params.id)
    await data?.load('communication_detail')
    if (data?.communication_detail) {
      data.communication_detail.status = 'deleted'
      await data?.communication_detail.save()
      return Driver.getResponse(1, 'driver.commDetails.deleted')
    }

    return Driver.getResponse(0, 'driver.commDetails.notFound')
  }
}

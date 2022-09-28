// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Driver from 'App/Models/Driver/Driver'
import DriverEmploymentDetail from 'App/Models/Driver/DriverEmploymentDetail'
import EmploymentDetailValidator from 'App/Validators/Driver/EmploymentDetailValidator'
import EmploymentValidator from 'App/Validators/Driver/Update/EmploymentValidator'

export default class EmploymentDetailsController {
  public async show({ request, params }) {
    let { audit } = request.qs()
    audit = audit === 'true' ? true : false
    const data = await Driver.findBy('driverUuid', params.id)
    if (!data) return Driver.getResponse(0, 'driver.employmentDetails.notFound')
    await data?.load('employment_detail', (q) => q.preload('work_status').preload('professional_level'))
    // if (data?.employment_detail.status === 'deleted') return Driver.getResponse(0, 'driver.employmentDetails.employmentDetailsDeleted')
    const result = data.employment_detail.serialize(!audit ? { fields: { omit: ['audit'] } } : {})
    if (data?.employment_detail) return Driver.getResponse(1, 'driver.employmentDetails.found', result)
  }
  public async store({ request, auth }) {
    const { driverId } = request.all()
    const data = await request.validate(EmploymentDetailValidator)
    const driver = await Driver.findBy('driverUuid', driverId)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    if (await DriverEmploymentDetail.findBy('driverId', driver.id)) return Driver.getResponse(0, 'driver.employmentDetails.alreadyExists')
    data.driverId = driver.id
    const employmentDetails = await DriverEmploymentDetail.create(data)
    employmentDetails.createdBy = auth.user.id
    employmentDetails.modifiedBy = auth.user.id
    await employmentDetails.save()
    return Driver.getResponse(1, 'driver.employmentDetails.created', employmentDetails)
  }
  public async update({ request, params, auth }) {
    const driver = await Driver.findBy('driverUuid', params.id)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    await driver.load('employment_detail')
    if (!driver.employment_detail) return Driver.getResponse(0, 'driver.employmentDetails.notFound')
    const employmentDetails = driver.employment_detail
    const data = await request.validate(EmploymentValidator)
    employmentDetails.merge(data)
    const changed = Object.keys(data)
    const fields: object[] = []
    for (const key in employmentDetails.$original) {
      if (changed.includes(key)) {
        fields.push({ field: key, value: employmentDetails.$original[key] })
      }
    }
    employmentDetails.audit.push({ udpatedAt: new Date().toISOString(), modifiedBy: auth.user.userId, fields })
    await employmentDetails.save()
    return Driver.getResponse(1, 'driver.employmentDetails.updated', employmentDetails)
  }
  public async destroy({ params }) {
    const data = await Driver.findBy('driverUuid', params.id)
    await data?.load('employment_detail')
    if (data?.employment_detail) {
      data.employment_detail.status = 'deleted'
      await data?.employment_detail.save()
      return Driver.getResponse(1, 'driver.employmentDetails.deleted')
    }
    return Driver.getResponse(0, 'driver.employmentDetails.notFound')
  }
}

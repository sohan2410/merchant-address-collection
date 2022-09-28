// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { countryToAlpha3 } from 'country-to-iso'
import Driver from 'App/Models/Driver/Driver'
import DriverUpdateValidator from 'App/Validators/Driver/DriverUpdateValidator'
import DriverValidator from 'App/Validators/Driver/DriverValidator'

export default class DriversController {
  public async index({ request }) {
    const page = request.input('page', 1)
    const limit = request.input('page_size', 10)

    const drivers = await Driver.query().where('status', '!=', 'deleted').paginate(page, limit)

    if (drivers.hasTotal) return Driver.getResponse(1, 'driver.found', drivers)
    return Driver.getResponse(0, 'driver.notFound')
  }
  public async show({ request, params }) {
    let { audit } = request.qs()
    audit = audit === 'true' ? true : false
    let driver: any
    driver = await Driver.findBy('driverUuid', params.id)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    if (driver.status === 'deleted') return Driver.getResponse(0, 'driver.driverDeleted')
    await driver.load((loader) =>
      loader
        .load('communication_detail')
        .load('employment_detail', (q) => q.preload('work_status').preload('professional_level').where('status', '!=', 'deleted'))
        .load('other_detail', (q) => q.preload('relationship_with_customer').preload('language_to_communicate'))
    )
    driver = driver.serialize(!audit ? { fields: { omit: ['audit'] } } : {})
    if (driver.communication_detail && !audit) delete driver.communication_detail['audit']
    if (driver.employment_detail && !audit) delete driver.employment_detail['audit']
    if (driver.other_detail && !audit) delete driver.other_detail['audit']
    return Driver.getResponse(1, 'driver.found', driver)
  }

  public async store({ request, auth }) {
    const profilePic = request.file('profilePic')
    const data = await request.validate(DriverValidator)
    const driver = await Driver.create(data)

    driver.nationalityIso = countryToAlpha3(data.nationality)
    driver.birthCountryIso = countryToAlpha3(data.birthCountry)
    driver.createdBy = auth.user.id
    driver.modifiedBy = auth.user.id
    if (profilePic) {
      await profilePic.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_profile_pic` }, 's3')
      driver.profilePic = profilePic.filePath
    }
    await driver.save()
    return Driver.getResponse(1, 'driver.created', driver)
  }
  public async update({ params, request, auth }) {
    const profilePic = request.file('profilePic')

    const data = await request.validate(DriverUpdateValidator)
    delete data['profilePic']
    const driver = await Driver.findBy('driverUuid', params.id)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    if (data.nationality) data.nationalityIso = countryToAlpha3(data.nationality)
    if (data.birthCountry) data.birthCountryIso = countryToAlpha3(data.birthCountry)
    if (profilePic) {
      await profilePic.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_profile_pic`, overwrite: true }, 's3')
      driver.profilePic = profilePic.filePath
    }
    driver?.merge(data)
    const changed = Object.keys(data)
    let fields: object[] = []
    for (const key in driver?.$original) {
      if (changed.includes(key)) {
        fields.push({ field: key, value: driver?.$original[key] })
      }
    }
    driver?.audit.push({ updatedAt: new Date().toISOString(), modifiedBy: auth.user.userId, fields })
    await driver?.save()
    return Driver.getResponse(1, 'driver.updated', driver)
  }
  public async destroy({ params }) {
    const driver = await Driver.findBy('driverUuid', params.id)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    driver.status = 'deleted'
    await driver.save()
    return Driver.getResponse(1, 'driver.deleted')
  }
}

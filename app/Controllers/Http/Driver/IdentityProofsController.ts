// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Driver from 'App/Models/Driver/Driver'
import DriverIdentityProof from 'App/Models/Driver/DriverIdentityProof'
import IdentityProofValidator from 'App/Validators/Driver/IdentityProofValidator'
import ProofOfIdentityValidator from 'App/Validators/Driver/Update/ProofOfIdentityValidator'

export default class IdentityProofsController {
  public async show({ request, params }) {
    let { audit } = request.qs()
    audit = audit === 'true' ? true : false
    let data: any
    data = await Driver.findBy('driverUuid', params.id)
    await data?.load('proof_of_identity')
    if (!data.proof_of_identity) return Driver.getResponse(0, 'driver.identityProofDetails.notFound')
    if (data.proof_of_identity.status === 'deleted') return Driver.getResponse(0, 'driver.identityProofDetails.statusDeleted')
    data.identity_proof_detail = data.proof_of_identity.serialize(!audit ? { fields: { omit: ['audit'] } } : {})
    if (data.proof_of_identity) return Driver.getResponse(1, 'driver.identityProofDetails.found', data.identity_proof_detail)
  }
  public async store({ request, auth }) {
    const { driverId } = request.all()
    const frontSide = request.file('frontSide')
    const backSide = request.file('backSide')
    const passportFrontSide = request.file('passportFrontSide')
    const passportBackSide = request.file('passportBackSide')
    const data = await request.validate(IdentityProofValidator)
    delete data['frontSide']
    delete data['backSide']
    delete data['passportFrontSide']
    delete data['passportBackSide']
    const driver = await Driver.findBy('driverUuid', driverId)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    if (await DriverIdentityProof.findBy('driverId', driver.id)) return Driver.getResponse(0, 'driver.identityProofDetails.alreadyExists')
    data.driverId = driver?.id
    if (data.passport) {
      if (passportFrontSide) {
        await passportFrontSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_passport_front_side` }, 's3')
        data.passportFrontSide = passportFrontSide.filePath
      }
      if (passportBackSide) {
        await passportBackSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_passport_front_side` }, 's3')
        data.passportBackSide = passportBackSide.filePath
      }
    } else {
      delete data['passportNumber']
      delete data['passportIssueDate']
      delete data['passportExpiryDate']
    }
    const identityProofDetails = await DriverIdentityProof.create(data)
    if (request.file('frontSide')) {
      await frontSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_kyc_front_side` }, 's3')
      identityProofDetails.frontSide = frontSide.filePath
    }
    if (request.file('backSide')) {
      await backSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_kyc_back_side` }, 's3')
      identityProofDetails.backSide = backSide.filePath
    }
    identityProofDetails.createdBy = auth.user.id
    identityProofDetails.modifiedBy = auth.user.id
    await identityProofDetails.save()
    return Driver.getResponse(0, 'driver.identityProofDetails.created', identityProofDetails)
  }
  public async update({ request, params, auth }) {
    const frontSide = request.file('frontSide')
    const backSide = request.file('backSide')
    const passportFrontSide = request.file('passportFrontSide')
    const passportBackSide = request.file('passportBackSide')
    const driver = await Driver.findBy('driverUuid', params.id)
    if (!driver) return Driver.getResponse(0, 'driver.notFound')
    await driver.load('proof_of_identity')
    if (!driver.proof_of_identity) return Driver.getResponse(0, 'driver.identityProofDetails.notFound')
    const poiDetails = driver.proof_of_identity
    const data = await request.validate(ProofOfIdentityValidator)
    delete data['frontSide']
    delete data['backSide']
    delete data['passportFrontSide']
    delete data['passportBackSide']
    console.log(data.passport)
    if (data.passport === false) {
      // delete data['passportNumber']
      // delete data['passportIssueDate']
      // delete data['passportExpiryDate']
      // delete data['passportIssuePlace']
      data.passportNumber = null
      data.passportIssueDate = null
      data.passportExpiryDate = null
      data.passportIssuePlace = null
      data.passportFrontSide = null
      data.passportBackSide = null
    } else {
      if (passportFrontSide) {
        await passportFrontSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_passport_front_side` }, 's3')
        data.passportFrontSide = passportFrontSide.filePath
      }
      if (passportBackSide) {
        await passportBackSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_passport_front_side` }, 's3')
        data.passportBackSide = passportBackSide.filePath
      }
    }
    if (request.file('frontSide')) {
      await frontSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_kyc_front_side` }, 's3')
      data.frontSide = frontSide.filePath
    }
    if (request.file('backSide')) {
      await backSide.moveToDisk('moxey-pinit', { name: `MX${driver.nationalityIso}-DR${driver.id}_kyc_back_side` }, 's3')
      data.backSide = backSide.filePath
    }
    poiDetails.merge(data)
    const changed = Object.keys(data)
    const fields: object[] = []
    for (const key in poiDetails.$original) {
      if (changed.includes(key)) {
        fields.push({ field: key, value: poiDetails.$original[key] })
      }
    }
    poiDetails.audit.push({ udpatedAt: new Date().toISOString(), modifiedBy: auth.user.userId, fields })
    await poiDetails.save()
    return Driver.getResponse(0, 'driver.identityProofDetails.updated', poiDetails)
  }
  public async destroy() {}
}

import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, afterFind, computed, BelongsTo, belongsTo, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { compose } from '@ioc:Adonis/Core/Helpers'

import File from 'App/Services/File'
import Functions from 'App/Services/Functions'

import Code from 'App/Models/Code'
import Role from 'App/Models/Role'
import Store from 'App/Models/Store/Store'

import { v4 as uuid } from 'uuid'
import Bull from '@ioc:Rocketseat/Bull'
import EMAIL_JOB from 'App/Jobs/Email'

import Logger from '@ioc:Adonis/Core/Logger'

export default class User extends compose(BaseModel, File, Functions) {
  // public static selfAssignPrimaryKey = true
  public static EMAIL_REGEX = new RegExp(process.env.EMAIL_REGEX || '')

  @computed()
  public role: string

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public userId: string

  @column({ serializeAs: null })
  public roleId: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @computed()
  public fullName: string

  @column()
  public dob: Date

  @column()
  public mobile: number

  @column()
  public firstLogin: boolean

  @column()
  public countryCode: number

  @column()
  public country: string

  @column()
  public status: string

  @column()
  public gender: string

  @attachment({
    folder: 'images/user',
    preComputeUrl: true,
  })
  public image?: AttachmentContract | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.userId = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterFind()
  public static async findRole(user: User) {
    await user.load('roles')
  }

  @afterFind()
  public static async findFullName(user: User) {
    user.fullName = user.firstName + ' ' + user.lastName
  }

  @hasMany(() => Store)
  public store: HasMany<typeof Store>

  @belongsTo(() => Role)
  public roles: BelongsTo<typeof Role>

  static async doLogin(auth, UserData) {
    try {
      let { username, password } = UserData

      let userData = await User.findByUsername(username)
      if (!userData) return User.getResponse(0, 'auth.accountNotFound')
      let token = await auth.attempt(userData.email, password, { expiresIn: '7days' })
      userData.load('roles')
      if (userData.firstLogin) return User.getResponse(1, 'auth.firstLoginSuccessful', userData, { token })
      return User.getResponse(1, 'auth.loginSuccessful', userData, { token })
    } catch (err) {
      Logger.error(err, UserData)
      return User.getResponse(0, `auth.${!err.uidField ? 'incorrectPassword' : 'accountNotFound'}`)
    }
  }
  static async findByUsername(username: string) {
    try {
      let user = User.query()
      if (User.EMAIL_REGEX.test(username)) user.where('email', username)
      else {
        user.where((query) => {
          query.where('mobile', username).orWhereRaw('concat(country,mobile) = ?', [username.replace('+', '')])
        })
      }
      let userData = await user.first()
      return userData
    } catch (error) {}
  }
  static async requestOtp(identity: string, template: string, locale: string) {
    identity = identity.trim()
    let user = await User.findByUsername(identity)

    if (!user && template != 'signup') return User.getResponse(0, 'auth.accountNotFound')

    let data = await User.getOTP(identity)
    if (User.EMAIL_REGEX.test(identity)) {
      //SEND EMAIL
      let email_data = { email: identity, button: { url: '#', label: data.otp }, locale: locale || 'en' }
      await Bull.schedule(new EMAIL_JOB().key, { data: email_data, type: template }, 20 * 1000)
    } else {
      //OTP for mobile goes here
    }

    return User.getResponse(2, 'auth.enterOTP', {
      msg: User.getMessage('auth.otpSentAgain'),
      otp: data.otp,
      type: User.EMAIL_REGEX.test(identity) ? 'email' : 'other',
      username: `${identity}`,
      // username: `${!User.EMAIL_REGEX.test(identity) ? '+' : ''}${identity}`,
    })
  }
  static async getOTP(identity) {
    //send OTP
    let codeRow = await Code.findBy('identifier', identity)
    codeRow = codeRow || new Code()
    codeRow.otp = User.getString(4)
    codeRow.identifier = identity.replace('+', '')
    await codeRow.save()
    return { otp: process.env.NODE_ENV == 'development' && codeRow.otp, msg: '' }
  }
  static async verifyOtp(data, remove = true) {
    let { username, otp } = data
    username = username.trim()

    let codeRow = await Code.query().where('identifier', username).orderBy('id', 'desc').first()

    if (!codeRow || codeRow.otp != otp) return User.getResponse(0, 'auth.wrongOTP')

    remove && (await codeRow.delete())

    if (codeRow.updatedAt.diffNow('minutes').minutes >= 20) {
      return User.getResponse(0, 'auth.expiredOTP')
    }

    return { error: 1 }
  }
}

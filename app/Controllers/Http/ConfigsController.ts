// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Config from 'App/Models/Config'
import User from 'App/Models/User'

export default class ConfigsController {
  public async index() {
    const configs = await Config.query().select(['key']).groupBy('key')
    let result = configs.map((config) => config.key)
    let data = {}
    for (var i = 0; i < result.length; i++) {
      data[result[i]] = await Config.query().where('key', result[i]).select(['id', 'key', 'value']).where('status', 'active')
    }
    if (data) return User.getResponse(1, 'user.config.found', data)

    return User.getResponse(0, 'user.config.notFound')
  }
}

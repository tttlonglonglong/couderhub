const errorType = require('../constants/error-types')
const service = require('../service/user.service')

const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')


class AuthController {
  async login(ctx, next) {

    console.log('AuthController', ctx.user)
    // 社保局哭查询的
    const { id, name } = ctx.user
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24 * 1000,
      algorithm: 'RS256'
    })

    // 接口传入的
    // const { name } = ctx.request.body;
    // ctx.body = `登录成功，欢迎${name}-${id}-${token}回来`
    ctx.body = {
      id,
      name,
      token
    }
  }
  async success(ctx, next){
    ctx.body = "验证成功"
  }
}

module.exports = new AuthController()
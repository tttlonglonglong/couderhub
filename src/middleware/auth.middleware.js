const jwt = require('jsonwebtoken')

const errorTypes = require('../constants/error-types')
const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/password-handle')

const { PUBLIC_KEY } = require('../app/config')


const verifyLogin = async (ctx, next) => {
  console.log('验证授权的middleware-verifyLogin')
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body
  console.log('登陆街口获取到的数据', ctx.request.body)
  // 2.判断用户名和密码是否为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 3.判断用户是否存在，存在才能登录
  const result = await userService.getUserByName(name)
  const user = result[0]
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 4.判断密码是否和数据库中的密码是一致(加密)
  console.log('md5password(password)', md5password(password), "user.password", user.password)
  if (md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }

  ctx.user = user // 透传user
  await next();
}


const verifyAuth = async (ctx, next) => {
  console.log('验证授权的middleware-verifyAuth', ctx.headers.authorization)
  // 1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')
  // console.log("当前请求的token", token)
  // 2.验证token(id/id/name/iot/exp)
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    })
    ctx.user = result  // 透传user
    await next()
  } catch (error) {
    console.log('verifyAuth--error', error)
    const err = new Error(errorTypes.UNAUTHORIZATION)
    ctx.app.emit('error', err, ctx)
  }
}

// 1.很多内容要验证权限： 修改/删除动态，修改/删除评论
// 2.接口：业务接口/后端管理系统  一对一：user -> role 多对多：role -> menu(删除动态/修改动态)
// 动态判断权限： tableName + [tableName + "Id"]
const verifyPermission = (tableName) => {
  return async (ctx, next) => {
    // 1.获取参数
    // const { momentId, content } = ctx.request.body
    const resourceId = ctx.request.body[tableName + "Id"]
    const { id } = ctx.user
    console.log('验证修改评论权限的middware～～', 'tableName', tableName, 'resourceId', tableName + "Id", ctx.request.body[tableName + "Id"])

    //2.查询是否具备权限
    try {
      // const isPermission = await authService.checkResource(tableName, momentId, id)
      const isPermission = await authService.checkResource(tableName, resourceId, id)
      console.log('verifyPermission---isPermission',isPermission)
      if (!isPermission) throw new Error()
      await next()
    } catch (err) {
      const error = new Error(errorTypes.UNPERMITION)
      ctx.app.emit('error', error, ctx)
    }
  }
}


module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}

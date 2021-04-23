const errorType = require('../constants/error-types')
const service = require('../service/user.service')
const md5password = require('../utils/password-handle')
class UserMiddleware {

}

const verifyUser = async (ctx, next) => {
  // 1.获取用户名密码
  const { name, password } = ctx.request.body;

  // 2.判断用户名或者密码不能空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 3.判断这次注册的用户名是没有被注册过
  const result = await service.getUserByName(name)
  console.log('教研数据库中是否有已经注册的用户名', result)
  if(result.length){
    const error = new Error(errorType.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  await next()
}

const handlePassword = async(ctx, next)=>{
  let { password } = ctx.request.body;
  ctx.request.body.password = md5password(password)

  await next();
}



module.exports = {
  verifyUser,
  handlePassword
}


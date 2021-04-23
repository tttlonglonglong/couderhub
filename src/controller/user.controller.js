const service  =require('../service/user.service')

class UserController {
  async create(ctx, next){
    // 获取用户请求传递的参数
    const user = ctx.request.body;
    console.log('ctx.request.body', ctx.request.body)

    // 查询数据库
    const result = await service.create(user)

    // // 返回数据
    ctx.body = result;
    // ctx.body = "请求服务成功"
  }
}

module.exports = new UserController()
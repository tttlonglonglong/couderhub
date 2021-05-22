const userService = require('../service/user.service')
const fileService = require('../service/file.service')

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;
    console.log('ctx.request.body', ctx.request.body)

    // 查询数据库
    const result = await userService.create(user)

    // // 返回数据
    ctx.body = result;
    // ctx.body = "请求服务成功"
  }

  async avatarInfo(ctx, next) {
    console.log('ctx.params', ctx.params)
    const { useId } = ctx.params
    const avatarInfo = await fileService.getAvatarByUserId(useId)
    ctx.body = avatarInfo

  }

}

module.exports = new UserController()
const momentService = require('../service/moment.service')

class MomentController {
  async create(ctx, next) {
    ctx.body = "发表动态成功！"
    // 1.获取数据(user_id, content, 图片)
    const userId = ctx.user.id
    const content = ctx.request.body.content
    console.log(userId, content)

    // 2.将数据插入到数据库
    const result = await momentService.create(userId, content)
    ctx.body = result
  }

  async detail(ctx, next) {
    //1.获取momentId
    const momentId = ctx.params.momentId
    console.log('ctx.query', ctx.query)

    //2.根据id去查询这条数据
    const result = await momentService.getMomentById(momentId)

    // ctx.body = "获取某一条动态的详情:" + momentId
    ctx.body = result
  }

  async list(ctx, next) {
    // 1. 获取数据(offset/size)
    const { offset, size } = ctx.query

    //2.查询列表
    const result = await momentService.getMomentList(offset, size)
    ctx.body = result
  }

  async update(ctx, next) {
    // 1.获取参数
    const { momentId, content } = ctx.request.body
    // 2.修改内容
    const result = await momentService.update(content, momentId)
    console.log('MomentController---update', ctx.request.body)
    ctx.body = result
  }

  async remove(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.request.body
    console.log('删除的结果', momentId)
    //2.删除内容
    const result = await momentService.remove(momentId)
    console.log('删除的结果', result)
    ctx.body = result
  }
}

module.exports = new MomentController()
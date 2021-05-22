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
    console.log('')
    // const momentId = ctx.params.momentId
    const { momentId } = ctx.request.body
    console.log('detail---ctx.query', ' ctx.request.body', ctx.request.body, 'ctx.query', ctx.query, 'ctx.param', ctx.params)

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

  async addLabels(ctx, next) {
    // 1.获取标签和动态id
    const { momentId } = ctx.request.body
    const labels = ctx.labels // 处理过的label，加了数据库id
    console.log('addLabels--labels', ctx.labels)
    console.log('addLabels--user', ctx.user)
    console.log('addLabels', labels, 'momentId', momentId)

    // 2.添加所有标签
    for (const label of labels) {
      // 2.1 判断标签是否已经和动态有过关系
      const isExist = await momentService.hasLabel(momentId, label.id);
      if (!isExist) {
        await momentService.addLabel(momentId, label.id)
      }
    }
    ctx.body = "给动态添加标签成功 ～"
  }
}

module.exports = new MomentController()
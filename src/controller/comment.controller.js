const commentService = require('../service/comment.service')

class ComentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body
    const { id } = ctx.user
    const result = await commentService.create(momentId, content, id)

    ctx.body = `发布评论成功～ + ${momentId} + ${content} + ${id}`
    ctx.body = result
  }

  async reply(ctx, next) {
    const { momentId, content, commentId } = ctx.request.body
    const { id } = ctx.user
    const result = await commentService.reply(momentId, content, id, commentId)
    ctx.body = result
  }
  // 更新评论信息
  async update(ctx, next) {
    const { content, commentId } = ctx.request.body
    ctx.body = `修改评论成功 ${content} ${commentId}`
    const result = await commentService.update(commentId, content)
    ctx.body = result
  }
  // 更新评论信息
  async remove(ctx, next) {
    const { commentId } = ctx.request.body
    ctx.body = `删除评论  ${commentId}`
    const result = await commentService.remove(commentId)
    console.log('删除评论的结果', result)
    ctx.body = result
  }

  // 获取评论列表
  async list(ctx, next){
    const { momentId } = ctx.request.body
    const result = await commentService.getCommentByMomentId(momentId)
    ctx.body = result
  }

}

module.exports = new ComentController()
const Router = require('koa-router')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, reply, update, remove } = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

commentRouter.post('/create', verifyAuth, create) // 对动态纪念性评论
commentRouter.post('/reply', verifyAuth, reply) // 对评论进行回复
commentRouter.post('/update', verifyAuth, verifyPermission('comment'), update) // 修改评论
commentRouter.delete('/delete', verifyAuth, verifyPermission('comment'), remove) // 修改评论

module.exports = commentRouter
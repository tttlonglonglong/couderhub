const Router = require('koa-router')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, reply, update, remove,list } = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

commentRouter.post('/create', verifyAuth, create) // 对动态进行评论
commentRouter.post('/reply', verifyAuth, reply) // 对评论进行回复
commentRouter.post('/update', verifyAuth, verifyPermission('comment'), update) // 修改评论
commentRouter.delete('/delete', verifyAuth, verifyPermission('comment'), remove) // 删除评论
commentRouter.get('/list', list) // 获取评论列表

module.exports = commentRouter
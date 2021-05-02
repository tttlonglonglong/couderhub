const Router = require('koa-router')

const momentRouter = new Router({ prefix: '/moment' })

const { create, detail, list, update, remove } = require('../controller/moment.controller.js')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')

momentRouter.post('/', verifyAuth, create)
momentRouter.get('/list', list)

// 1.用户必须登陆 2.用户具备权限
momentRouter.patch('/update', verifyAuth, verifyPermission('moment'), update)
momentRouter.delete('/delete', verifyAuth, verifyPermission('moment'), remove)
momentRouter.get('/:momentId', detail)


module.exports = momentRouter
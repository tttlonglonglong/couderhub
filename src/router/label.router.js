const Router = require('koa-router')
const { 
  verifyAuth
 } = require('../middleware/auth.middleware')
const {
  create,
  list
} = require('../controller/label.controller.js')

const labelRouter = new Router({ prefix: '/label' })

labelRouter.post('/create',verifyAuth, create)
labelRouter.post('/list',verifyAuth, list)

// todo
// labelRouter.post('/update',verifyAuth, list)
// labelRouter.post('/delete',verifyAuth, list)



module.exports = labelRouter
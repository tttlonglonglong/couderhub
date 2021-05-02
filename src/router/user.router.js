const Router = require('koa-router')
const {
  create
} = require('../controller/user.controller')

const {
  verifyUser,
  handlePassword
} = require('../middleware/user.middleware')

// 路径 - 中间件处理的 映射(没有app.post/get，只有app.use)
const userRouter = new Router({ prefix: '/users' })

userRouter.post('/', verifyUser, handlePassword, create)

// userRouter.post('/', (ctx, next)=>{
//   console.log('接受到了请求', ctx)
//   ctx.body = "创建用户成功～"
// });

module.exports = userRouter;
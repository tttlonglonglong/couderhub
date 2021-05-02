const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()

const testRouter = new Router()

// 登陆接口，登陆成功返回cookie
testRouter.get('/login', async (ctx, next) => {
    // 服务端对应的是毫秒
    ctx.cookies.set('name', 'lilei', {
        'maxAge': 30 * 1000
    })
    ctx.body = "test"
    await next()
})

testRouter.get('/demo', async (ctx, next) => {
    // 读取cookie
    const name = ctx.cookies.get('name')
    console.log('读取到的cookie', name)
    ctx.body = "当前的cookie是" + name
})


app.use(testRouter.routes())
app.use(testRouter.allowedMethods())

app.listen(8000, () => {
    console.log("服务:8000启动成功！")
})
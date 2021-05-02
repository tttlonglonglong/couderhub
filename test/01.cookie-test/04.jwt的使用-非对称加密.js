const Koa = require('koa')
const Router = require('koa-router')
const Session = require('koa-session')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const app = new Koa()

const testRouter = new Router()

// 创建session配置
const session = Session({
    'key': 'sessionid',
    maxAge: 10 * 1000,
    signed: true // 是否使用加密签名
}, app)
app.keys = ["aaaaaa"] // 加密加盐 
app.use(session)


// 登陆接口，登陆成功返回cookie
testRouter.get('/login', async (ctx, next) => {
    // 服务端对应的是毫秒
    ctx.cookies.set('name', 'lilei', {
        'maxAge': 30 * 1000,
    })
    ctx.body = "test-login"
    await next()
})

testRouter.get('/demo', async (ctx, next) => {
    // 读取cookie
    const name = ctx.cookies.get('name')
    console.log('读取到的cookie', name)
    ctx.body = "当前的cookie是" + name
})

testRouter.get('/getSession', async (ctx, next) => {
    // 读取cookie
    console.log('读取到的cookie', ctx.session.user)
    ctx.body = "当前的cookie是" + ctx.session.user.name
})
testRouter.get('/session', async (ctx, next) => {
    // 登陆成功设置session
    const id = 10
    const name = 'coderhub'
    ctx.session.user = { id, name }

    ctx.body = "session" + name
})


const SECRET_KEY = 'abcsba1234'
const PRIVATE_KEY = fs.readFileSync('./keys/private.key')
const PUBLIC_KEY = fs.readFileSync('./keys/public.key')
testRouter.get('/getToken', async (ctx, next) => {
    const user = { id: 10, name: 'coderhub' }
    // 使用私钥颁发签名
    const token = jwt.sign(user, PRIVATE_KEY, {
        expiresIn: 10 * 1000,
        algorithm: "RS256" // 指定使用的非对称加密的算法
    })
    ctx.body = token
})
testRouter.get('/decodeToken', async (ctx, next) => {
    const authorization = ctx.headers.authorization
    const token = authorization.replace('Bearer ', '')
    try {
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ["RS256"]
        })
        console.log('token解密出来的结果！', result)
        ctx.body = result
    } catch (error) {
        ctx.body = 'token是无效的'
    }

})

app.use(testRouter.routes())
app.use(testRouter.allowedMethods())

app.listen(8000, () => {
    console.log("服务:8000启动成功！")
})
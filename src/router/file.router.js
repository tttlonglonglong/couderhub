const Router = require('koa-router')

const {
  verifyAuth
} = require('../middleware/auth.middleware')
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require('../middleware/file.middleware')
const {
  create,
  saveAvatarInfo,
  savePictureInfo,
  fileInfo
} = require('../controller/file.controller')

const fileRouter = new Router({ prefix: '/upload' })



// 中间件(保存图像) mimetype/filename/userId/size 
// 控制器(保存图像的信息)
fileRouter.post('/avatar', verifyAuth, avatarHandler,pictureResize, create)
fileRouter.get('/avatarInfo/:useId',  avatarHandler, saveAvatarInfo)
fileRouter.post('/picture',  verifyAuth, pictureHandler, pictureResize,savePictureInfo)
fileRouter.get('/moment/images/:filename', fileInfo)

module.exports = fileRouter;
const fs = require('fs')

const fileService = require('../service/file.service')
const userService = require('../service/user.service')
const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path')
const { APP_HOST, APP_PORT } = require('../app/config')

class FileController {
  async create(ctx, next) {
    // 1.获取图像相关的信息
    // req和request的区别
    const { filename, mimetype, size } = ctx.req.file
    // console.log('FileController', ctx.req.file)
    const { id } = ctx.user

    // 2.将图像信息数据保存到数据库中
    const result = await fileService.createAvatar({ filename, mimetype, size, userId: id })
    console.log('FileController---', result)

    // 3.将图片地址保存到user表中
    // const avatarUrl = `${APP_HOST}:${APP_PORT}/upload/avatarInfo/${id}`;
    const avatarUrl = `${AVATAR_PATH}/${filename}`;
    await userService.updateAvatarUrlById(avatarUrl, id)

    // 4. 返回获取到的头像
    // ctx.body = result
    ctx.body = `上传头像成功～`

  }
  async saveAvatarInfo(ctx, next) {
    // 1.获取用户的头像
    const { useId } = ctx.params
    const avatarInfo = await fileService.getAvatarByUserId(useId)
    console.log('ctx.params', ctx.params, 'avatarInfo', avatarInfo)
    // ctx.body = avatarInfo

    // 2.返回图像信息
    ctx.response.set('content-type', avatarInfo.mimetype)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)

  }

  async savePictureInfo(ctx, next) {
    // 1. 获取图像信息
    const files = ctx.req.files;
    const { id } = ctx.user
    const { momentId } = ctx.query

    // 2.将所有文件信息保存到数据库
    for (const file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createFile({ filename, mimetype, size, userId: id, momentId })
    }

    ctx.body = "动态配图上传成功～ "
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params
    const fileInfo = fileService.getFileByFilename(filename)

    const { type } = ctx.query
    const types = ['small', 'middle', 'large']
    if (types.some(item => item === type)) {
      // 返回不同大小的图片
      filename = filename+ '-' + type
    }
    console.log('/upload/moment/images/', fileInfo)
    ctx.response.set('content-type', fileInfo.mimetype)
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
  }

}

module.exports = new FileController()
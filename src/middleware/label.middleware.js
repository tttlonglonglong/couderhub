const errorTypes = require('../constants/error-types')
const labelService = require('../service/label.service')





const verifyLabelExists = async (ctx, next) => {
  // 1. 取出要添加的所有标签
  const { labels } = ctx.request.body

  // 2.判断每一个标签在label 表中是否存在
  const newLabels = [];
  for (const name of labels) {
    const labelResult = await labelService.getLabelByName(name);
    const label = { name }
    if (!labelResult) {
      // 创建标签数据
      const result = await labelService.create(name)
      label.id = result.insertId
    } else {
      label.id = labelResult.id
    }
    console.log('newLabels', newLabels)

    ctx.labels = newLabels
    newLabels.push(label)
  }

  await next();
}





module.exports = {
  verifyLabelExists
}

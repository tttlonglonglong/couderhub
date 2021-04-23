const fs = require('fs');
const path = require('path');

// 对所有的路由进行注册
const useRoutes = function(app){
    // 拿到文件夹下所有的文件
    fs.readdirSync(__dirname).forEach(file => {
      if(file === 'index.js') return;
      const router = require(`./${file}`);
      app.use(router.routes());
      app.use(router.allowedMethods())
    })
}


module.exports = useRoutes
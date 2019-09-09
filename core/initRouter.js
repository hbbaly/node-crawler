const requireDirectory = require('require-directory')
const Router = require('koa-router')

// 配置绝对路径
const configPath = `${process.cwd()}/routes`
class InitRouter {
  static routerCore (app) {
    InitRouter.app = app
    InitRouter.initLoadRouter()
  }
  static initLoadRouter() {
    const loadRouter = (pagePath) => {
      if (pagePath instanceof Router) InitRouter.app.use(pagePath.routes())
    }
    requireDirectory(module, configPath, {visit: loadRouter})
  }
}
module.exports = InitRouter


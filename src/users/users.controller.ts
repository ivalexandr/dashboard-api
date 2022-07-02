import { BaseController } from '../common/base.controller'
import { IControllerRoute } from '../common/route.interface'
import { LoggerService } from '../logger/logger.service'

export class UserController extends BaseController {
  routes: IControllerRoute[]
  constructor(logger: LoggerService) {
    super(logger)
    this.routes = [
      {
        path: '/login',
        method: 'post',
        func(req, res, next) {
          res.send('login')
        },
      },
      {
        path: '/register',
        method: 'post',
        func(req, res, next) {
          res.send('register')
        },
      },
    ]
    this.bindRoutes(this.routes)
  }
}

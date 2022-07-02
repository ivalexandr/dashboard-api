import { Request, Response, NextFunction } from 'express'
import { BaseController } from '../common/base.controller'
import { IControllerRoute } from '../common/route.interface'
import { HTTPError } from '../errors/http-error.class'
import { LoggerService } from '../logger/logger.service'

export class UserController extends BaseController {
  routes: IControllerRoute[]
  constructor(logger: LoggerService) {
    super(logger)
    this.routes = [
      {
        path: '/login',
        method: 'post',
        func: this.login,
      },
      {
        path: '/register',
        method: 'post',
        func: this.register,
      },
    ]
    this.bindRoutes(this.routes)
  }

  login = (req: Request, res: Response, next: NextFunction) => {
    next(new HTTPError(401, 'Ошибка авторизации', 'login'))
  }

  register = (req: Request, res: Response, next: NextFunction) => {
    this.ok(res, 'register')
  }
}

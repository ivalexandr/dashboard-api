import { Request, Response, NextFunction } from 'express'
import { injectable, inject } from 'inversify'
import { BaseController } from '../common/base.controller'
import { IControllerRoute } from '../common/route.interface'
import { HTTPError } from '../errors/http-error.class'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import { IUserController } from './users.interface'
import 'reflect-metadata'

@injectable()
export class UserController extends BaseController implements IUserController {
  routes: IControllerRoute[]
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService)
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

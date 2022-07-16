import { Request, Response, NextFunction } from 'express'
import { injectable, inject } from 'inversify'
import { BaseController } from '../common/base.controller'
import { IControllerRoute } from '../common/route.interface'
import { HTTPError } from '../errors/http-error.class'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import { IUserController } from './users.interface'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { IUsersService } from './users.service.interface'
import { ValidateMidleware } from '../common/validate.midleware'
import 'reflect-metadata'

@injectable()
export class UserController extends BaseController implements IUserController {
	routes: IControllerRoute[]
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUsersService,
	) {
		super(loggerService)
		this.routes = [
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMidleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMidleware(UserRegisterDto)],
			},
		]
		this.bindRoutes(this.routes)
	}

	login = async (
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const result = await this.userService.validateUser(body)
		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации', 'login'))
		}
		this.loggerService.log(`[UserController] Пользователь ${body.email} авторизовался`)
		this.ok(res, body)
	}

	register = async (
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const result = await this.userService.createUser(body)
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует', 'user has been'))
		}
		this.ok(res, { email: result.email, id: result.id })
	}
}

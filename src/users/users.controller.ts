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
import { IConfigService } from '../config/config.service.interface'
import { sign } from 'jsonwebtoken'
import { GuardMiddleware } from '../common/auth.guard'
import 'reflect-metadata'

@injectable()
export class UserController extends BaseController implements IUserController {
	routes: IControllerRoute[]
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new GuardMiddleware()],
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
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'))
		this.loggerService.log(`[UserController] Пользователь ${body.email} авторизовался`)
		this.ok(res, { body, jwt })
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

	info = async ({ user }: Request, res: Response, next: NextFunction): Promise<void> => {
		const result = await this.userService.getUserInfo(user)
		if (!result) {
			return next()
		}
		this.ok(res, { email: result.email, id: result.id })
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err)
					}
					res(token as string)
				},
			)
		})
	}
}

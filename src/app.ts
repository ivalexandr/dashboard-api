import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import { ILogger } from './logger/logger.interface'
import { TYPES } from './types'
import { json } from 'body-parser'
import { IConfigService } from './config/config.service.interface'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { IUserController } from './users/users.interface'
import { PrismaService } from './database/prisma.service'
import { AuthMiddleware } from './common/auth.middleware'
import 'reflect-metadata'

@injectable()
export class App {
	app: Express
	server: Server
	port: number

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: IUserController,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express()
		this.port = 8000
	}

	useMiddleware(): void {
		this.app.use(json())
		this.app.use(new AuthMiddleware(this.configService.get('SECRET')).execute)
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router)
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch)
	}

	public async init(): Promise<void> {
		this.useMiddleware()
		this.useRoutes()
		this.useExeptionFilters()
		await this.prismaService.connect()
		this.server = this.app.listen(this.port)
		this.logger.log(`Server is listening on port ${this.port}`)
	}
}

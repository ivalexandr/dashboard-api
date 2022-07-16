import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import { ExeptionFilter } from './errors/exeption.filter'
import { ILogger } from './logger/logger.interface'
import { TYPES } from './types'
import { UserController } from './users/users.controller'
import { json } from 'body-parser'
import 'reflect-metadata'
@injectable()
export class App {
	app: Express
	server: Server
	port: number

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express()
		this.port = 8000
	}

	useMiddleware(): void {
		this.app.use(json())
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
		this.server = this.app.listen(this.port)
		this.logger.log(`Server is listening on port ${this.port}`)
	}
}

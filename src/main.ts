import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { ExeptionFilter } from './errors/exeption.filter'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { UserController } from './users/users.controller'
import { IUserController } from './users/users.interface'
import { IUsersService } from './users/users.service.interface'
import { UsersService } from './users/users.service'
import { IConfigService } from './config/config.service.interface'
import { ConfigService } from './config/config.service'
import { PrismaService } from './database/prisma.service'

export interface IBootstrapReturn {
	appContainer: Container
	app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter).inSingletonScope()
	bind<IUserController>(TYPES.UserController).to(UserController)
	bind<IUsersService>(TYPES.UserService).to(UsersService)
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inRequestScope()
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
	bind<App>(TYPES.Application).to(App)
})

const bootstrap = (): IBootstrapReturn => {
	const appContainer = new Container()
	appContainer.load(appBindings)
	const app = appContainer.get<App>(TYPES.Application)
	app.init()
	return { appContainer, app }
}

export const { appContainer, app } = bootstrap()

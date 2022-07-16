import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { ExeptionFilter } from './errors/exeption.filter'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { UserController } from './users/users.controller'
import { IUserController } from './users/users.interface'

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService)
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter)
  bind<IUserController>(TYPES.UserController).to(UserController)
  bind<App>(TYPES.Application).to(App)
})

const bootstrap = () => {
  const appContainer = new Container()
  appContainer.load(appBindings)
  const app = appContainer.get<App>(TYPES.Application)
  app.init()
  return { appContainer, app }
}

export const { appContainer, app } = bootstrap()

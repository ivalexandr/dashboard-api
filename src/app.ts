import express, { Express } from 'express'
import { userRouter } from './users/users'
import { Server } from 'http'
import { LoggerService } from './logger/logger.service'
import { UserController } from './users/users.controller'

export class App {
  app: Express
  server: Server
  port: number
  logger: LoggerService

  constructor(logger: LoggerService) {
    this.app = express()
    this.port = 8000
    this.logger = logger
  }

  useRoutes() {
    this.app.use('/users', new UserController(this.logger).router)
  }

  public async init() {
    this.useRoutes()
    this.server = this.app.listen(this.port)
    this.logger.log(`Server is listening on port ${this.port}`)
  }
}

import { inject, injectable } from 'inversify'
import { PrismaClient, UserModel } from '@prisma/client'
import { ILogger } from '../logger/logger.interface'
import { TYPES } from '../types'

@injectable()
export class PrismaService {
	client: PrismaClient
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient()
	}

	connect = async (): Promise<void> => {
		try {
			await this.client.$connect()
			this.logger.log('[PrismaService] База данных подключена')
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`[PrismaService] Ошибка подключения к базу данных: ${error.message} `)
			}
		}
	}

	disconnect = async (): Promise<void> => {
		await this.client.$disconnect()
		this.logger.log('[PrismaService] База данных отключена')
	}
}

import { UserModel } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { PrismaService } from '../database/prisma.service'
import { TYPES } from '../types'
import { User } from './user.entity'
import { IUsersRepo } from './users.repo.interface'

@injectable()
export class UsersRepo implements IUsersRepo {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	create = async ({ email, password, name }: User): Promise<UserModel> => {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		})
	}

	find = async (email: string): Promise<UserModel | null> => {
		return this.prismaService.client.userModel.findFirst({
			where: { email },
		})
	}
}

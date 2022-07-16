import { inject, injectable } from 'inversify'
import { UserRegisterDto } from './dto/user-register.dto'
import { User } from './user.entity'
import { IUsersService } from './users.service.interface'
import { TYPES } from '../types'
import { IConfigService } from '../config/config.service.interface'
import { IUsersRepo } from './users.repo.interface'
import { UserModel } from '@prisma/client'
import 'reflect-metadata'

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepo: IUsersRepo,
	) {}

	createUser = async ({ name, password, email }: UserRegisterDto): Promise<UserModel | null> => {
		const newUser = new User(email, name)
		const salt = this.configService.get('SALT')
		await newUser.setPassword(password, Number(salt))
		const existedUser = await this.usersRepo.find(email)
		if (existedUser) {
			return null
		}
		return this.usersRepo.create(newUser)
	}

	validateUser = async (dto: UserRegisterDto): Promise<boolean> => {
		return true
	}
}

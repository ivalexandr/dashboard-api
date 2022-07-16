import { inject, injectable } from 'inversify'
import { UserRegisterDto } from './dto/user-register.dto'
import { User } from './user.entity'
import { IUsersService } from './users.service.interface'
import { TYPES } from '../types'
import { IConfigService } from '../config/config.service.interface'
import 'reflect-metadata'

@injectable()
export class UsersService implements IUsersService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
	createUser = async ({ name, password, email }: UserRegisterDto): Promise<User | null> => {
		const newUser = new User(email, name)
		const salt = this.configService.get('SALT')
		await newUser.setPassword(password, Number(salt))
		return null
	}
	validateUser = async (dto: UserRegisterDto): Promise<boolean> => {
		return true
	}
}

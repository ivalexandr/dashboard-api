import { UserModel } from '@prisma/client'
import { UserRegisterDto } from './dto/user-register.dto'

export interface IUsersService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>
	validateUser: (dto: UserRegisterDto) => Promise<boolean>
}

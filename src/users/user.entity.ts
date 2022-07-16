import { compare, hash } from 'bcryptjs'

export class User {
	private _password: string
	constructor(
		private readonly _email: string,
		private readonly _name: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash
		}
	}

	get email(): string {
		return this._email
	}

	get password(): string {
		return this._password
	}

	get name(): string {
		return this._name
	}

	public setPassword = async (pass: string, salt: number): Promise<void> => {
		this._password = await hash(pass, salt)
	}

	public comparePassword = async (pass: string): Promise<boolean> => {
		return await compare(pass, this._password)
	}
}

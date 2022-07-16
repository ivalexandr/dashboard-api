import { ClassConstructor, plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { IMiddleware } from './middleware.interface'

export class ValidateMidleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute = async ({ body }: Request, res: Response, next: NextFunction): Promise<void> => {
		const instance = plainToClass(this.classToValidate, body)
		const errors = await validate(instance)
		if (errors.length > 0) {
			res.status(422).send(errors)
		} else {
			next()
		}
	}
}

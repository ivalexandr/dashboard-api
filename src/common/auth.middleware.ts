import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { IMiddleware } from './middleware.interface'

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute = (req: Request, res: Response, next: NextFunction): void => {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					next()
				} else if (payload) {
					const email = payload as string
					req.user = email
					next()
				}
			})
		}
		next()
	}
}

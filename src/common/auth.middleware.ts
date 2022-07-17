import { Request, Response, NextFunction } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import { IMiddleware } from './middleware.interface'

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute = (req: Request, res: Response, next: NextFunction): void => {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					next()
				} else if (payload) {
					if (typeof payload === 'object') {
						const user = payload.email
						req.user = user
						next()
					} else {
						next()
					}
				}
			})
		} else {
			next()
		}
	}
}

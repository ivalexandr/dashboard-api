import { Request, Response, NextFunction, request } from 'express'
import { IMiddleware } from './middleware.interface'
import { decode } from 'jsonwebtoken'

export class GuardMiddleware implements IMiddleware {
	execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (req.user) {
			return next()
		}
		res.status(401).send({ error: 'Вы не авторизованы' })
	}
}

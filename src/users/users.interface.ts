import { Request, Response, NextFunction, Router } from 'express'
import { IControllerRoute } from '../common/route.interface'

interface IUserController {
	routes: IControllerRoute[]
	login: (req: Request, res: Response, next: NextFunction) => void
	register: (req: Request, res: Response, next: NextFunction) => void
	router: Router
}

export { IUserController }

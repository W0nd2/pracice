const jwt = require('jsonwebtoken')
import {Request,Response,NextFunction} from 'express'

export default function (role: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            
            if (!token) {
                return res.status(401).json({ message: "Пользователь не авторизован" })
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (!role.includes(decoded.role)) {
                return res.status(403).json({ message: "У пользователя не достаточно прав" })
            }
            next();
        } catch (e) {
            res.status(401).json({ message: "Пользователь не авторизован" })
        }
    }
}
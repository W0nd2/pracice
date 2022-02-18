const jwt = require('jsonwebtoken')
const roleService = require('../services/roleService')

module.exports = function (role: any) {
    return function (req: any, res: any, next: any) { //мб реквест заменить на ени
        try {
            const token = req.headers.authorization.split(' ')[1]
            
            if (!token) {
                return res.status(401).json({ message: "Пользователь не авторизован" })
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (!role.includes(decoded.role)) {
                return res.status(403).json({ message: "У пользователя не достаточно прав" })
            }
            //req.user = decoded;
            next();
        } catch (e) {
            res.status(401).json({ message: "Пользователь не авторизован" })
        }
    }
}
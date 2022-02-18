"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Пользователь не авторизован" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        //req.user = decoded;
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Пользователь не авторизован" });
    }
};
//# sourceMappingURL=authMiddleware.js.map
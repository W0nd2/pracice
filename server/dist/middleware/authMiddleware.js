"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
function default_1(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Пользователь не авторизован" });
        }
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Пользователь не авторизован" });
    }
}
exports.default = default_1;
//# sourceMappingURL=authMiddleware.js.map
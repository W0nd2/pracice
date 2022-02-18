"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogedIn = void 0;
const isLogedIn = (req, res, next) => {
    try {
        if (req.method === 'OPTIONS')
            return next();
        if (req.user)
            return next();
        return res.status(401).json({ message: 'Not authorized' });
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
    }
};
exports.isLogedIn = isLogedIn;
//# sourceMappingURL=logedGoogleMiddleware.js.map
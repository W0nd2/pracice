"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
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
}
exports.default = default_1;
//# sourceMappingURL=logedGoogleMiddleware.js.map
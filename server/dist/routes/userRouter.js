"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rout = require('express');
const userRoutes = new Rout();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const isLogedIn = require('../middleware/logedGoogleMiddleware');
const passport_1 = __importDefault(require("passport"));
// auth
// POST
userRoutes.post('/login', userController.login);
userRoutes.post('/registration', userController.registration);
// GET
userRoutes.get('/auth', authMiddleware, userController.checkJwt);
// GET GOOGLE
userRoutes.get('/google', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
userRoutes.get('/google/callback', passport_1.default.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
}));
userRoutes.get('/google/success', isLogedIn, userController.successGoogleAuth);
userRoutes.get('/google/failure', userController.failureGoogleAuth);
userRoutes.get('/google/logout', userController.logoutGoogle);
module.exports = userRoutes;
//# sourceMappingURL=userRouter.js.map
const Rout = require('express')
const authRoutes = new Rout()
import {body,check} from 'express-validator'
import userController from '../controllers/userController'
import authMiddleware from '../middleware/authMiddleware'
import authController from '../controllers/authController'
import isLogedIn from '../middleware/logedGoogleMiddleware'
import passport from 'passport';

// POST

// логин пользователя
authRoutes.post('/login',[
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isLength({min:5,max:25})
], authController.login);

// регистрация пользователя
authRoutes.post('/registration',[
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isLength({min:5,max:25}),
    body('login','Incorrect login').isLength({min:2,max:25})//.matches(/^[A-Z]+[a-zA-z]+$/)
], authController.registration);

authRoutes.post('/login/google', authController.loginGoogle);

// GET
// проверка токена
authRoutes.get('/auth', authMiddleware, authController.checkJwt);

// GET GOOGLE
authRoutes.get('/google',passport.authenticate('google', { scope: [ 'email', 'profile' ] }));

authRoutes.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/api/auth/google/success',
        failureRedirect: '/api/auth/google/failure'
}));

authRoutes.get('/google/success',isLogedIn, authController.successGoogleAuth);

authRoutes.get('/google/failure', authController.failureGoogleAuth);

authRoutes.get('/google/logout', authController.logoutGoogle);

// //потом удалить
authRoutes.post('/roleAdd', userController.roleCreate)

export default authRoutes
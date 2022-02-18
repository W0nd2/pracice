const Rout = require('express')
const authRoutes = new Rout()
import {body,check} from 'express-validator'
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const isLogedIn = require('../middleware/logedGoogleMiddleware')
const Role = require('../middleware/checkRoleMiddleware')
import passport from 'passport';

// POST
authRoutes.post('/login',[
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isLength({min:5,max:25})
], userController.login);

authRoutes.post('/registration',[
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isLength({min:5,max:25}),
    body('login','Incorrect login').isLength({min:2,max:25})//.matches(/^[A-Z]+[a-zA-z]+$/)
], userController.registration);

authRoutes.post('/login/google', userController.loginGoogle);

// GET
//проверка токена
authRoutes.get('/auth', authMiddleware, userController.checkJwt);

// GET GOOGLE
authRoutes.get('/google',passport.authenticate('google', { scope: [ 'email', 'profile' ] }));

authRoutes.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/api/auth/google/success',
        failureRedirect: '/api/auth/google/failure'
}));

authRoutes.get('/google/success',isLogedIn, userController.successGoogleAuth);

authRoutes.get('/google/failure', userController.failureGoogleAuth);

authRoutes.get('/google/logout', userController.logoutGoogle);

// //потом удалить
authRoutes.post('/roleAdd', userController.roleCreate)

module.exports = authRoutes
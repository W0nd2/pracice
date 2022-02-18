const Rout = require('express')
const userRoutes = new Rout()
import {body, check} from 'express-validator'
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const isLogedIn = require('../middleware/logedGoogleMiddleware')
const Role = require('../middleware/checkRoleMiddleware')
import passport from 'passport';

//возможно не надо делать это
// userRoutes.get('/checklogin', authMiddleware, userController.checkLogin);
// userRoutes.get('/role', authMiddleware, userController.checkRole);


userRoutes.get('/profile', authMiddleware, userController.checkProfile);

//  password

userRoutes.get('/password/change',[
    //body('email', 'Incorrect email').isString().isEmail()
    
], authMiddleware, userController.changePassword);

userRoutes.path('/password/:link',[
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isString().isLength({min:5,max:25})
], authMiddleware, userController.forgotPassport);
//userRoutes.get('/team', authMiddleware, userController.checkTeam);



// PATCH
userRoutes.patch('/login/change',[
    body('login','Incorrect login').isString().matches(/^[A-Z]+[a-zA-z]+$/).isLength({min:2,max:25})
], authMiddleware, userController.changeLogin);

userRoutes.patch('/avatar/change', authMiddleware, userController.changeAvatar);


// TEAM

// отправка запроса на регистрацию в команду
userRoutes.post('/newTeamMember',authMiddleware,userController.newTeamMember);

// отправка запроса на выход из очереди
userRoutes.delete('/declineQueue',authMiddleware,userController.declineQueue);

// просмотр всех участников команды
userRoutes.get('/teamMembers',authMiddleware, userController.teamMembers);

// просмотр всех членов команд
userRoutes.get('/allMembers',authMiddleware, userController.allMembers);

// запрос на переход в другую команду
userRoutes.post('/memberToAnotherTeam',authMiddleware, userController.changeComand)

module.exports = userRoutes
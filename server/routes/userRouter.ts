const Rout = require('express')
const userRoutes = new Rout()
import {body, check} from 'express-validator'
const userController = require('../controllers/userController')
const teamController = require('../controllers/teamController')
const authMiddleware = require('../middleware/authMiddleware')

//возможно не надо делать это
// userRoutes.get('/checklogin', authMiddleware, userController.checkLogin);
// userRoutes.get('/role', authMiddleware, userController.checkRole);

//просмотр профайла своего
userRoutes.get('/profile', authMiddleware, userController.checkProfile);

//  password

// запрос на отправку письма на почту
userRoutes.post('/password/change',[
    //body('email', 'Incorrect email').isString().isEmail()
    body('email', 'Incorrect email').isEmail()
], userController.changePassword);

// изменение пароля
userRoutes.path('/password/:link',[
    
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isString().isLength({min:5,max:25})
], userController.forgotPassport);

//userRoutes.get('/team', authMiddleware, userController.checkTeam);



// PATCH

// изменение логина
userRoutes.patch('/login/change',[
    body('newLogin','Incorrect login').isString().isLength({min:2,max:25})
], authMiddleware, userController.changeLogin);

// изменение аватара
userRoutes.patch('/avatar/change', authMiddleware, userController.changeAvatar);


// TEAM

// отправка запроса на регистрацию в команду
userRoutes.post('/newTeamMember',authMiddleware,teamController.newTeamMember);

// запрос на переход в другую команду
userRoutes.post('/memberToAnotherTeam',authMiddleware, teamController.changeComand)

// отправка запроса на выход из очереди
userRoutes.delete('/declineQueue',authMiddleware,teamController.declineQueue);

// просмотр всех участников команды
userRoutes.get('/teamMembers',authMiddleware, teamController.teamMembers);

// просмотр всех членов команд
userRoutes.get('/allMembers',authMiddleware, teamController.allMembers);


module.exports = userRoutes
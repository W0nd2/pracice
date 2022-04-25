const Rout = require('express')
const userRoutes = new Rout()
import {body, check} from 'express-validator'
import userController from '../controllers/userController'
import teamController from'../controllers/teamController'
import authMiddleware from'../middleware/authMiddleware'


userRoutes.get('/profile', authMiddleware, userController.checkProfile);


userRoutes.post('/password/change',[
    body('email', 'Incorrect email').isEmail()
], userController.changePassword);

// изменение пароля
userRoutes.patch('/password',[
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isString().isLength({min:5,max:25})
], userController.forgotPassword);




// PATCH

// изменение логина
userRoutes.patch('/login/change',
    body('newLogin','Incorrect login').isString().isLength({min:3,max:25})
, authMiddleware, userController.changeLogin);

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

userRoutes.get('/getMember',authMiddleware, teamController.getMember);

export default userRoutes
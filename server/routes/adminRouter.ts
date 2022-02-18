const Rout = require('express')
const adminRoutes = new Rout()
import {check,body} from 'express-validator'
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const isLogedIn = require('../middleware/logedGoogleMiddleware')
const Role = require('../middleware/checkRoleMiddleware')
import passport from 'passport';

// MANAGER

// MANAGER POST

adminRoutes.post('/login/manager',[
    body('email', 'Incorrect email').isString().isEmail(),
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isString().isLength({min:5,max:25}),
    Role(['ADMIN'])
], userController.loginManager);//вход под аккаунтом манеджера

//adminRoutes.post('/comandAdd', [authMiddleware,Role(['ADMIN'])], userController.comandAdd)
// MANAGER GET



// MANAGER PATCH



// ADMIN

// ADMIN POST

// ADMIN GET
adminRoutes.get('/managerByID', [authMiddleware,Role(['ADMIN'])], userController.getManagerById);//полная информация про менеджера по ID

adminRoutes.get('/allManagers', [authMiddleware,Role(['ADMIN'])], userController.getManagers);//полная информация про всех менеджеров



// ADMIN PATCH
adminRoutes.patch('/blockUser', [
    authMiddleware,Role(['ADMIN'])
], userController.blockUser);               //блокировка пользователя

adminRoutes.patch('/unblockUser', [
    authMiddleware,Role(['ADMIN'])
], userController.unblockUser);             //разблокировка пользователя

adminRoutes.patch('/confirmManager', [authMiddleware,Role(['ADMIN'])],userController.confirmManager);//подтверждение регистрации менеджера
adminRoutes.patch('/decline', [authMiddleware,Role(['ADMIN'])],userController.declineManager);//отклоняет регистрацию менеджера

// MANAGER + ADMIN

adminRoutes.get('/userById', [authMiddleware,Role(['MANAGER','ADMIN'])] , userController.getUserById);//полная информация про пользователя по ID

adminRoutes.get('/queue',[authMiddleware,Role(['MANAGER','ADMIN'])], userController.getqueue);

// TEAM

//  Удаление из таблицы запросов на вступление в окманду
adminRoutes.delete('/declineByManager',[authMiddleware,Role(['MANAGER','ADMIN'])],userController.declineByManager);

// подтверждение запроса на вступление в команду
adminRoutes.post('/confirmMember',[authMiddleware,Role(['MANAGER','ADMIN'])],userController.confirmMember)

// подтверждение на переход пользователя в другую команду
adminRoutes.post('/confirmToAnotherTeam',[authMiddleware,Role(['MANAGER','ADMIN'])], userController.confirmToAnotherTeam)

// отклонене запроса пользоватля на переход в другую команду
adminRoutes.delete('/declineToAnotherTeam',[authMiddleware,Role(['MANAGER','ADMIN'])], userController.declineToAnotherTeam)

module.exports = adminRoutes
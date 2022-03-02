const Rout = require('express')
const adminRoutes = new Rout()
import {check,body} from 'express-validator'
const authMiddleware = require('../middleware/authMiddleware')
const adminController = require('../controllers/adminController')
const Role = require('../middleware/checkRoleMiddleware')

// MANAGER

// MANAGER POST

//вход под аккаунтом манеджера
adminRoutes.post('/login/manager',[
    body('email', 'Incorrect email').isString().isEmail(),
    body('password', 'Incorrect password. Password must have from 5 to 25 characters').isString().isLength({min:5,max:25}),
    Role(['ADMIN'])
], adminController.loginManager);              

//adminRoutes.post('/comandAdd', [authMiddleware,Role(['ADMIN'])], userController.comandAdd)
// MANAGER GET



// MANAGER PATCH



// ADMIN

// ADMIN POST

// ADMIN GET

//полная информация про менеджера по ID
adminRoutes.get('/managerByID',[
    authMiddleware,Role(['ADMIN'])
], adminController.getManagerById);             

//полная информация про всех менеджеров
adminRoutes.get('/allManagers',[
    authMiddleware,Role(['ADMIN'])
], adminController.getManagers);                



// ADMIN PATCH

//блокировка пользователя
adminRoutes.patch('/blockUser', [
    authMiddleware,Role(['ADMIN'])
], adminController.blockUser);                  

//разблокировка пользователя
adminRoutes.patch('/unblockUser', [
    authMiddleware,Role(['ADMIN'])
], adminController.unblockUser);                

//подтверждение регистрации менеджера
adminRoutes.patch('/confirmManager',[
    authMiddleware,Role(['ADMIN'])
],adminController.confirmManager);              

//отклоняет регистрацию менеджера
adminRoutes.patch('/decline',[
    authMiddleware,Role(['ADMIN'])
],adminController.declineManager);              

// MANAGER + ADMIN

//полная информация про пользователя по ID
adminRoutes.get('/userById', [
    authMiddleware,Role(['MANAGER','ADMIN'])
] , adminController.getUserById);               




// TEAM

//получить очередь запросов
adminRoutes.get('/queue',[
    authMiddleware,Role(['MANAGER','ADMIN'])
], adminController.getqueue);

//  Удаление из таблицы запросов на вступление в окманду
adminRoutes.delete('/declineByManager',[
    authMiddleware,Role(['MANAGER','ADMIN'])
], adminController.declineByManager);

// подтверждение запроса на вступление в команду
adminRoutes.post('/confirmMember',[
    authMiddleware,Role(['MANAGER','ADMIN'])
], adminController.confirmMember)

// подтверждение на переход пользователя в другую команду
adminRoutes.post('/confirmToAnotherTeam',[
    authMiddleware,Role(['MANAGER','ADMIN'])
], adminController.confirmToAnotherTeam)

// отклонене запроса пользоватля на переход в другую команду
adminRoutes.delete('/declineToAnotherTeam',[
    authMiddleware,Role(['MANAGER','ADMIN'])
], adminController.declineToAnotherTeam)

module.exports = adminRoutes
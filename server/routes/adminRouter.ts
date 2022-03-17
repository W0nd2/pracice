const Rout = require('express')
const adminRoutes = new Rout()
import {check,body} from 'express-validator'
import authMiddleware from '../middleware/authMiddleware'
import adminController from '../controllers/adminController'

import Role from '../middleware/checkRoleMiddleware'

// MANAGER

// MANAGER POST


/* костыль для команд */
import userController from '../controllers/userController'
adminRoutes.post('/comandAdd', [authMiddleware,Role(['ADMIN'])], userController.comandAdd)

adminRoutes.get('/membersOncomand', adminController.getmembers)
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

export default adminRoutes
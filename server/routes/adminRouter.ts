const Rout = require('express')
const adminRoutes = new Rout()
import authMiddleware from '../middleware/authMiddleware'
import adminController from '../controllers/adminController'
import Role from '../middleware/checkRoleMiddleware'

enum Access {
    Manager ='MANAGER',
    Administrator ='ADMIN'
}

// MANAGER
adminRoutes.get('/membersOncomand', adminController.getmembers)

// ADMIN

// ADMIN GET

//полная информация про менеджера по ID
adminRoutes.get('/managerByID',[
    authMiddleware,Role([Access.Administrator])
], adminController.getManagerById);             

//полная информация про всех менеджеров
adminRoutes.get('/allManagers',[
    authMiddleware,Role([Access.Administrator])
], adminController.getManagers);                

// ADMIN PATCH

//блокировка пользователя
adminRoutes.patch('/blockUser', [
    authMiddleware,Role([Access.Administrator])
], adminController.blockUser);                  

//разблокировка пользователя
adminRoutes.patch('/unblockUser', [
    authMiddleware,Role([Access.Administrator])
], adminController.blockUser);                

//подтверждение регистрации менеджера
adminRoutes.patch('/confirmManager',[
    authMiddleware,Role([Access.Administrator])
],adminController.confirmManager);              

//отклоняет регистрацию менеджера
adminRoutes.patch('/decline',[
    authMiddleware,Role([Access.Administrator])
],adminController.declineManager);              

// MANAGER + ADMIN

//полная информация про пользователя по ID
adminRoutes.get('/userById', [
    authMiddleware,Role([Access.Manager,Access.Administrator])
] , adminController.getUserById);               

// TEAM

//  получить очередь запросов
adminRoutes.get('/queue',[
    authMiddleware,Role([Access.Manager,Access.Administrator])
], adminController.getqueue);

adminRoutes.patch('/memberToTeam',[
    authMiddleware,Role([Access.Manager,Access.Administrator])
],adminController.memberToTeam);

// подтверждение на переход пользователя в другую команду
adminRoutes.post('/confirmToAnotherTeam',[
    authMiddleware,Role([Access.Manager,Access.Administrator])
], adminController.confirmToAnotherTeam)

// отклонене запроса пользоватля на переход в другую команду
adminRoutes.delete('/declineToAnotherTeam',[
    authMiddleware,Role([Access.Manager,Access.Administrator])
], adminController.declineToAnotherTeam)

adminRoutes.delete('/deleteUserFromTeam',[
    authMiddleware,Role([Access.Manager,Access.Administrator])
],adminController.deleteUserFromTeam)

export default adminRoutes
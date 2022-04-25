"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rout = require('express');
const userRoutes = new Rout();
const express_validator_1 = require("express-validator");
const userController_1 = __importDefault(require("../controllers/userController"));
const teamController_1 = __importDefault(require("../controllers/teamController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
userRoutes.get('/profile', authMiddleware_1.default, userController_1.default.checkProfile);
userRoutes.post('/password/change', [
    (0, express_validator_1.body)('email', 'Incorrect email').isEmail()
], userController_1.default.changePassword);
// изменение пароля
userRoutes.patch('/password', [
    (0, express_validator_1.body)('password', 'Incorrect password. Password must have from 5 to 25 characters').isString().isLength({ min: 5, max: 25 })
], userController_1.default.forgotPassword);
// PATCH
// изменение логина
userRoutes.patch('/login/change', (0, express_validator_1.body)('newLogin', 'Incorrect login').isString().isLength({ min: 3, max: 25 }), authMiddleware_1.default, userController_1.default.changeLogin);
// изменение аватара
userRoutes.patch('/avatar/change', authMiddleware_1.default, userController_1.default.changeAvatar);
// TEAM
// отправка запроса на регистрацию в команду
userRoutes.post('/newTeamMember', authMiddleware_1.default, teamController_1.default.newTeamMember);
// запрос на переход в другую команду
userRoutes.post('/memberToAnotherTeam', authMiddleware_1.default, teamController_1.default.changeComand);
// отправка запроса на выход из очереди
userRoutes.delete('/declineQueue', authMiddleware_1.default, teamController_1.default.declineQueue);
// просмотр всех участников команды
userRoutes.get('/teamMembers', authMiddleware_1.default, teamController_1.default.teamMembers);
// просмотр всех членов команд
userRoutes.get('/allMembers', authMiddleware_1.default, teamController_1.default.allMembers);
userRoutes.get('/getMember', authMiddleware_1.default, teamController_1.default.getMember);
exports.default = userRoutes;
//# sourceMappingURL=userRouter.js.map
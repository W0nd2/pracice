"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const roleModel_1 = __importDefault(require("../models/roleModel"));
const comandModel_1 = __importDefault(require("../models/comandModel"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const userService_1 = __importDefault(require("../services/userService"));
const fileService_1 = __importDefault(require("../services/fileService"));
class UserController {
    // после того как будет все готово убрать
    async roleCreate(req, res, next) {
        try {
            const { newRole } = req.body;
            const role = await roleModel_1.default.create({ userRole: newRole });
            return res.json({ role });
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    async comandAdd(req, res, next) {
        try {
            const { newComand } = req.body;
            const comand = await comandModel_1.default.create({ comandName: newComand });
            return res.json({ comand });
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    //-----
    async checkProfile(req, res, next) {
        try {
            const id = req.user.id;
            if (!id) {
                return ApiError_1.default.internal('Пользователь не авторизирован');
            }
            let user = await userService_1.default.checkProfile(id);
            return res.json(user);
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    async changeLogin(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }
            const id = req.user.id;
            if (!id) {
                return ApiError_1.default.internal('Пользователь не авторизирован');
            }
            const { newLogin } = req.body;
            let user = await userService_1.default.changeLogin(id, newLogin);
            return res.json(user);
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    async changeAvatar(req, res, next) {
        try {
            const id = req.user.id;
            if (!id) {
                return ApiError_1.default.internal('Пользователь не авторизирован');
            }
            const { avatar } = req.files;
            let fileName = fileService_1.default.uploadFile(avatar);
            let user = await userService_1.default.changeAvatar(id, fileName);
            return res.json(user);
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }
            let { email } = req.body;
            let message = await userService_1.default.changePassword(email);
            return res.json({ message });
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }
            // const id = req.user?.id
            // if(!id)
            // {
            // return ApiError.internal('Пользователь не подавал заявку на смену пароля');
            // }
            const { password, token } = req.body;
            let message = await userService_1.default.forgotPassword(password, token);
            return res.json({ message });
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=userController.js.map
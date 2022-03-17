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
    //-------------------------------------------------------------------------------------------------------
    // PROFILE
    async checkProfile(req, res, next) {
        try {
            const id = req.user?.id;
            if (!id) {
                return ApiError_1.default.internal('Пользователь не авторизирован');
            }
            let user = await userService_1.default.checkProfile(id);
            return res.json(user);
            console.log(req.user);
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    // USER LOGIN
    async changeLogin(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors });
            }
            const id = req.user?.id;
            if (!id) {
                return ApiError_1.default.internal('Пользователь не авторизирован');
            }
            const { newLogin } = req.body;
            console.log(id, newLogin);
            let user = await userService_1.default.changeLogin(id, newLogin);
            return res.json(user);
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    // AVATAR
    async changeAvatar(req, res, next) {
        try {
            const id = req.user?.id;
            if (!id) {
                return ApiError_1.default.internal('Пользователь не авторизирован');
            }
            const { avatar } = req.files;
            console.log('------------------------------------------------------');
            console.log(typeof (avatar));
            //let fileName = uuid.v4() + ".jpg";
            //avatar.mv(path.resolve(__dirname, '..', 'static', fileName))
            let fileName = fileService_1.default.uploadFile(avatar);
            let user = await userService_1.default.changeAvatar(id, fileName);
            return res.json(user);
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    // PASSWORD
    async changePassword(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors });
            }
            const { email } = req.body;
            console.log(email);
            await userService_1.default.changePassword(email);
            return res.json({ message: 'Письмо отправлено на почту' });
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const id = req.user?.id;
            if (!id) {
                return ApiError_1.default.internal('Пользователь не авторизирован');
            }
            const { password } = req.body;
            return (userService_1.default.forgotPassword(id, password));
        }
        catch (error) {
            console.log(error);
            return ApiError_1.default.internal(error);
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=userController.js.map
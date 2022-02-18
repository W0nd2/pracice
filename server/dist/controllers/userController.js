"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const { User } = require('../models/models');
const jwt = require('jsonwebtoken');
const genereteJwt = (id, email, login, role) => {
    return jwt.sign({ id, email, login, role }, //payload
    process.env.SECRET_KEY, { expiresIn: '12h' });
};
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, login, role } = req.body;
            if (!email || !password) {
                return next(ApiError.bedRequest('Некорректный email или password'));
            }
            const candidate = yield User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.bedRequest('Пользователь с таким email уже существует'));
            }
            const hashPassword = yield bcrypt.hash(password, 5);
            const user = yield User.create({ email, password: hashPassword, login, role });
            const token = genereteJwt(user.id, user.email, user.login, user.role);
            return res.json(token);
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.internal('Пользователя с таким email не существует'));
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal('Неверный пароль'));
            }
            const token = genereteJwt(user.id, user.email, user.login, user.role);
            return res.json(token);
        });
    }
    checkJwt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email, login, role } = req.body;
            const token = genereteJwt(id, email, login, role);
            return res.json({ token });
        });
    }
}
module.exports = new UserController();
//# sourceMappingURL=userController.js.map
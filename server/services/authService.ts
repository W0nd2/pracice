const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../error/ApiError');
import Model from "../models/models";
//const jwt = require('jsonwebtoken')
const mailService = require('../services/mailService')
const blockService = require('../services/blockService')

class AuthService {
    // -------- AUTH --------
    async registration(email: string, password: string, login: string, role: number) {
        const candidate = await Model.User.findOne({ where: { email } })
        if (candidate) {
            return ApiError.bedRequest('Пользователь с таким email уже существует')
        }
        // if(role = 3)
        // {
        //     return ApiError.bedRequest('Пользователя с такой ролью нельзя добавить в базу данных')
        // }
        const hashPassword = await bcrypt.hash(password, 5);
        const link = uuid.v4()
        const user = await Model.User.create({ email, password: hashPassword, login, roleId: role, activationlink: link })
        await Model.Banlist.create({ userId: user.id })
        if (role == 2) {
            await Model.AproveList.create({ userId: user.id })
        }
        return user;
    }

    async login(email: string, password: string) {
        const user = await Model.User.findOne({ where: { email } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        if(user.roleId == 2 && !user.managerActive)
        {
            return ApiError.internal('Администратор ещё не подтвержил вашу заявку')
        }
        if (user.accountType === 'Google') {
            return ApiError.internal('Пользователь зареистрированый')
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return ApiError.internal('Неверный пароль')
        }
        return user;
    }

    async googleAuth(email: string, name: string) {
        let user = await Model.User.findOne({ email });
        console.log(user)
        if (!user) {
            user = await Model.User.create({ email, login: name, accountType: 'Google' })
        }
        return user;
    }

    async loginGoogle(email: string) {
        const user = await Model.User.findOne({ where: { email } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        return user;
    }

    // -------- AUTH --------
}

module.exports = new AuthService()
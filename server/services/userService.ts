const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../error/ApiError');
import Model from "../models/models";
//const jwt = require('jsonwebtoken')
const mailService = require('../services/mailService')
const blockService = require('../services/blockService')

class UserService {
    // -------- USER --------

    // PROFILE
    async checkProfile(id: number){
        const user = await Model.User.findOne({where: {id} })
        if(!user)
        {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        return user
    }

    // LOGIN
    async changeLogin(id: number, newLogin: string) {
        const user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        user.login = newLogin;
        await user.save();
        return user;
    }

    // AVATAR
    async changeAvatar(id: number, fileName: string) {
        const user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        user.avatar=fileName;
        await user.save();
    }

    // PASSWORD
    async forgotPassword(id: number, newPassword: string){
        const user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        const hashPassword = await bcrypt.hash(newPassword, 5);
        user.password = hashPassword;
        user.save()
        return user
    }

    async changePassword(email: string) {
        // отправить ссылку на почту для смены пароля
        const user = await Model.User.findOne({where:{email}})
        if(!user){
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        //переделать немного(на почту отправляеться ссылка на бек, переделать на ссылку на фронт, когда будет готов)
        mailService.sendMail(user.email, `http://127.0.0.1:5500/client/password.html`)
    }

    // -------- USER --------
}

module.exports = new UserService()
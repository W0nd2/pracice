const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../error/ApiError');
import Model from "../models/models";
//const jwt = require('jsonwebtoken')
const mailService = require('../services/mailService')
const blockService = require('../services/blockService')

class UserService {

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
        const user = await Model.User.create({ email, password: hashPassword, login, roleId:role, activationlink: link})
        await Model.Banlist.create({userId: user.id})
        if(role == 2)
        {
            await Model.AproveList.create({userId:user.id})
        }
        return user;
    }

    async login(email: string, password: string) {
        const user = await Model.User.findOne({ where: { email } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
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

    async changePassword(id: number) {
        // отправить ссылку на почту для смены пароля
        const user = await Model.User.findOne({where:{id}})
        if(!user){
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        //переделать немного(на почту отправляеться ссылка на бек, переделать на ссылку на фронт, когда будет готов)
        mailService.sendMail(user.email, `${process.env.API_URL}/user/password/${user.activationlink}`)
    }

    // -------- USER --------

    // -------- MANAGER --------

    async loginManager(email: string, password: string) {
        let user = await Model.User.findOne({ where: { email } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        if (user.role != "MANAGER") {
            return ApiError.internal('Пользователь не отправлял заявку на роль MANAGER')
        }
        //проверка на то что админ подтвердил регистрацию
        if (!user.managerActive) {
            return ApiError.internal('Администратор ещё не подтвердил заявку на роль MANAGER')
        }
        return user
    }

    // -------- MANAGER --------

    // -------- ADMIN --------

    async confirmManager(id: number, reason: string) {
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        if (user.roleId != "2") {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        if (user.managerActive){
            return ApiError.internal('Пользователь уже являеться MANAGER')
        }
        user.managerActive = true;

        //мб не надо
        //let aproveRes = await Model.AproveList.create({userId: id,reason})
        //user.aproveRes = aproveRes.id;
        //
        let aprove = await Model.AproveList.findOne({where:{userId:id}});
        aprove.reason = reason;
        aprove.save()
        user.save()
        return user;
    }

    async declineManager(id: number, reason: string) {
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        if (user.roleId != "2") {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        //Model.Banlist.create({userId: id,reason})
        
        //
        //
        //
        //
        user.managerActive = false;
        user.save()
        return user;
    }

    async getManagerById(id: number) {
        let manager = await Model.User.find({ where: { id } })
        if (!manager) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        if (manager.role != 'MANAGER') {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        return manager
    }
    
    async getManagers(role: string){
        let managers = await Model.User.findAll({where:{role}})
        return managers;
    }


    // -------- ADMIN --------

    // -------- MANAGER + ADMIN --------

    async getUserById(id: number) {
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        if (user.role == "MANAGER") {
            if (!user.managerActive) {
                return ApiError.internal('Администратор ещё не подтвердил заявку на роль MANAGER')
            }
        }
        return user
    }

    // -------- MANAGER + ADMIN --------




    // -------- TEAM --------


    //  перделать запросы под новые таблицы
    async newMember(userId:number, comandId: number){
        let user = await Model.requestComand.findOne({where: {userId}})
        let userInComand = await Model.UserComand.findOne({where: {userId}})
        let comand = await Model.Comand.findOne({where: {id:comandId}})
        let flag = blockService.isBlocked(userId)
        console.log(flag)
        console.log(user)
        if(user)
        {
            return ApiError.internal('Пользователь с таки ID уже состоит в очереди')
        }
        if(userInComand){
            return ApiError.internal('Пользователь с таки ID уже в команде')
        }
        // if(blockService.isBlocked(userId))
        // {
        //     return ApiError.internal('Пользователь находиться в блокировке')
        // }
        if(!comand)
        {
            return ApiError.internal('Данной команды не существует')
        }
        let queue = await Model.requestComand.create({userId, comandId})
        return queue;
    }

    async changeComand(userId:number, comandId: number){
        //let user = await Model.requestComand.findOne({where: {userId}})
        let userInComand = await Model.UserComand.findOne({where: {userId}})
        let comand = await Model.Comand.findOne({where: {id:comandId}})
        let members = await Model.UserComand.findAndCountAll({where:comandId})
        if(members == 10)
        {
            return ApiError.internal('Команда, в которую вы хотите перейти, полностью укомплектована')
        }
        // if(!user)
        // {
        //     return ApiError.internal('Пользователя с таки ID не существует')
        // }
        if(!userInComand)
        {
            return ApiError.internal('Пользователь с таки ID не состоит в команде, вы не можете подать заяку на переход в другую команду')
        }
        if(!comand)
        {
            return ApiError.internal('Данной команды не существует')
        }
        let queue = await Model.requestComand.create({userId, comandId})
        return queue;
    }

    async confirmMemberToAnTeam(userId:number, comandId: number){
        //переделать (убирать с таблицы прошлую запись пользователя)
        let user = await Model.User.findOne({where:{id:userId}})
        let userInReq = await Model.requestComand.findOne({where: {userId}})
        let comand = await Model.Comand.findOne({where: {id:comandId}})
        let members = await Model.UserComand.findAndCountAll({where:comandId})
        console.log(members)
        if(members == 10)
        {
            return ApiError.internal('Команда полностью укомплектована')
        }
        if(!user)
        {
            return ApiError.internal('Пользователя с таки ID не существует')
        }
        if(!userInReq)
        {
            return ApiError.internal('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду')
        }
        // if(blockService.isBlocked(userId))
        // {
        //     return ApiError.internal('Пользователь находиться в блокировке')
        // }
        if(!comand)
        {
            return ApiError.internal('Данной команды не существует')
        }
        await Model.UserComand.destroj({where:{userId}})                    // удаление пользователя с команды
        let newMember = await Model.UserComand.create({userId, comandId})   // добавление пользователя в новую команду
        await Model.requestComand.destroy({where:{userId}})                 // удаление пользователя из запросов
        return newMember;
    }

    async declineToAnotherTeam(userId:number){
        let user = await Model.User.findOne({where:{id:userId}})
        let userInReq = await Model.requestComand.findOne({where:{userId}})
        if(!user)
        {
            return ApiError.internal('Пользователя с таки ID не существует')
        }
        if(!userInReq)
        {
            return ApiError.internal('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду')
        }
        await Model.requestComand.destroy({where:{userId}})
    }

    async confirmMember(userId:number, comandId: number){
        let user = await Model.User.findOne({where:{id:userId}})
        let userInReq = await Model.requestComand.findOne({where: {userId}})
        let comand = await Model.Comand.findOne({where: {id:comandId}})
        let members = await Model.UserComand.findAndCountAll({where:comandId})
        console.log(members)
        if(members == 10)
        {
            return ApiError.internal('Команда полностью укомплектована')
        }
        if(!user)
        {
            return ApiError.internal('Пользователя с таки ID не существует')
        }
        if(!userInReq)
        {
            return ApiError.internal('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду')
        }
        // if(blockService.isBlocked(userId))
        // {
        //     return ApiError.internal('Пользователь находиться в блокировке')
        // }
        if(!comand)
        {
            return ApiError.internal('Данной команды не существует')
        }
        let newMember = await Model.UserComand.create({userId, comandId})
        await Model.requestComand.destroy({where:{userId}})
        return newMember;
    }

    async declineQueue(userId:number){
        let user = await Model.requestComand.findOne({where:{userId}})
        if(!user){
            return ApiError.internal('Пользователь с таким ID не состоит в очереди')
        }
        let queue = Model.requestComand.destroy({where:{userId}})
        return queue;
    }

    async allQueue(){
        let queue = await Model.requestComand.findAll()
        if(!queue)
        {
            return ApiError.internal('Очередь пуста')
        }
        return queue;
    }

    async teamMembers(comandId:number){
        let members = await Model.UserComand.findAll({where:{comandId}})
        if(members.length == 0){
            return ApiError.internal('Команда пустая')
        }
        return members;
    }

    async allMembers(){
        let members = await Model.UserComand.findAll()
        if(!members){
            return ApiError.internal('Обе команды пусты')
        }
        return members;
    }

    // -------- TEAM --------
}

module.exports = new UserService()
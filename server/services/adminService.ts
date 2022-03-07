const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../error/ApiError');
import Model from "../models/models";
//const jwt = require('jsonwebtoken')
const mailService = require('../services/mailService')
const blockService = require('../services/blockService')

class AdminService {
    // -------- MANAGER --------

    // async loginManager(email: string, password: string) {
    //     let user = await Model.User.findOne({ where: { email } })
    //     if (!user) {
    //         return ApiError.internal('Пользователя с таким email не существует')
    //     }
    //     if (user.role != "MANAGER") {
    //         return ApiError.internal('Пользователь не отправлял заявку на роль MANAGER')
    //     }
    //     //проверка на то что админ подтвердил регистрацию
    //     if (!user.managerActive) {
    //         return ApiError.internal('Администратор ещё не подтвердил заявку на роль MANAGER')
    //     }
    //     return user
    // }

    // -------- MANAGER --------

    // -------- ADMIN --------

    async confirmManager(id: number, reason: string) {
        console.log(id,reason)
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        if (user.roleId != "2") {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        if (user.managerActive) {
            return ApiError.internal('Пользователь уже являеться MANAGER')
        }
        user.managerActive = true;

        //мб не надо
        //let aproveRes = await Model.AproveList.create({userId: id,reason})
        //user.aproveRes = aproveRes.id;
        //
        let aprove = await Model.AproveList.findOne({ where: { userId: id } });
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
        let manager = await Model.User.findOne({ where: { id } })
        if (!manager) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        
        if (manager.roleId != '2') {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        return manager
    }

    async getManagers(roleId: string) {
        let managers = await Model.User.findAll({ where: { roleId } })
        return managers;
    }


    // -------- ADMIN --------

    // -------- MANAGER + ADMIN --------

    async getUserById(id: number) {
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        if (user.roleId == 2) {
            if (!user.managerActive) {
                return ApiError.internal('Администратор ещё не подтвердил заявку на роль MANAGER')
            }
        }
        return user
    }

    // -------- MANAGER + ADMIN --------

    // -------- TEAM --------

    //
    

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

    //сделать проверку есть ли пользователь в таблице 
    async confirmMember(userId:number, comandId: number){
        let user = await Model.User.findOne({where:{id:userId}})
        let userInReq = await Model.requestComand.findOne({where: {userId}})
        let comand = await Model.Comand.findOne({where: {id:comandId}})
        let members = await Model.UserComand.findAndCountAll({where:comandId})
        console.log(members)
        if( await Model.UserComand.findOne({where:{userId}})){
            await Model.requestComand.destroy({where:{userId}})
            return ApiError.internal('Пользователь уже состоит в команде')
        }
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

    

    // -------- TEAM --------
}

module.exports = new AdminService()
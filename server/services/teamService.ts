const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../error/ApiError');
import Model from "../models/models";
//const jwt = require('jsonwebtoken')
const mailService = require('../services/mailService')
const blockService = require('../services/blockService')

class TeamService{
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

    async teamMembers(userId:number){
        //переделать
        let member = await Model.UserComand.findOne({where:{userId}})
        let comandId = member.comandId
        let teamMembers =await Model.UserComand.findAll({where:{comandId}})
        if(teamMembers.length == 0){
            return ApiError.internal('Команда пустая')
        }
        return teamMembers;
    }

    async allMembers(){
        let members = await Model.UserComand.findAll()
        if(!members){
            return ApiError.internal('Обе команды пусты')
        }
        return members;
    }
}

module.exports = new TeamService()
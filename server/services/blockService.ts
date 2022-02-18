const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
import Model from "../models/models";
//const jwt = require('jsonwebtoken')

class BlockService{

    //  запись в базу причины блокировки
    async blockUser(id:number, blockReason: string){
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        let blockedUser = await Model.Banlist.findOne({where:{userId:user.id}})
        if(blockedUser.isBlocked)
        {
            return ApiError.internal('Пользователь уже находиться в блокировке')
        }
        blockedUser.isBlocked = true;
        blockedUser.reason = blockReason;
        blockedUser.save()
        return blockedUser
    }

    //  запись в базу причины разблокировки
    async unBlockUser(id:number){
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        let blockedUser = await Model.Banlist.findOne({where:{userId:user.id}})
        if(!blockedUser.isBlocked)
        {
            return ApiError.internal('Пользователя уже разблокировали')
        }
        blockedUser.isBlocked = false;
        blockedUser.reason = null;
        blockedUser.save()
        //let block  = await Model.Banlist.create({isBlocked: false ,reason: null})
        return blockedUser
    }

    async isBlocked(id:number){
        let user = await Model.Banlist.findOne({where: {userId: id}})
        return user.isBlocked
    }
}

module.exports = new BlockService()
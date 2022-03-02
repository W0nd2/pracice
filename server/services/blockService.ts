import Model from "../models/models";
const ApiError = require('../error/ApiError');

class BlockService{

    
    async blockUser(id:number, reason: string, blockFlag: boolean){
        let user = await Model.User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        let blockedUser = await Model.Banlist.findOne({where:{userId:user.id}})
        if(blockedUser.isBlocked == blockFlag)
        {
            return ApiError.internal('Пользователь уже находиться в блокировке или разблокирован')
        }
        blockedUser.isBlocked = blockFlag;
        blockedUser.reason = reason;
        blockedUser.save();
        return blockedUser;
    }

    async isBlocked(id:number){
        let user = await Model.Banlist.findOne({where: {userId: id}})
        return user.isBlocked
    }
    
}

module.exports = new BlockService()
import Banlist from '../models/banlistModel';
import User from '../models/userModel';
import ApiError from '../error/ApiError';

class BlockService{
    
    async blockUser(id:number, reason: string, blockFlag: boolean):Promise<Banlist | ApiError>{
        let user = await User.findOne({where:{id}})
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        let blockedUser = await Banlist.findOne({where:{userId:user.id}})
        if(blockedUser.isBlocked == blockFlag)
        {
            return ApiError.internal('Пользователь уже находиться в блокировке или разблокирован')
        }
        blockedUser.isBlocked = blockFlag;
        blockedUser.reason = reason;
        blockedUser.save();
        return blockedUser;
    }
    
    async isBlocked(id:number):Promise<boolean | ApiError>{
        let user = await Banlist.findOne({where: {userId: id}})
        if(!user){
            return ApiError.internal('Пользователя с таким id не существует')
        }
        return user.isBlocked
    }
    
}

export default new BlockService()
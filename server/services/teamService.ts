import User from '../models/userModel';
import ApiError from '../error/ApiError';
import Comand from '../models/comandModel';
import requestComand from '../models/requestcomandModel';
import UserComand from '../models/usercomandModel';
import blockService from '../services/blockService';

class TeamService{
    async newMember(userId:number, comandId: number):Promise<requestComand | ApiError>{
        let user = await requestComand.findOne({where: {userId}})
        let userInComand = await UserComand.findOne({where: {userId}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let flag = await blockService.isBlocked(userId)
        if(user)
        {
            return ApiError.internal('Пользователь с таки ID уже состоит в очереди')
        }
        if(userInComand){
            return ApiError.internal('Пользователь с таки ID уже в команде')
        }
        if(!comand)
        {
            return ApiError.internal('Данной команды не существует')
        }
        if(flag){
            return ApiError.internal('Пользователь заблокирован')
        }
        let queue = await requestComand.create({userId, comandId})
        return queue;
    }

    async changeComand(userId:number, comandId: number):Promise<requestComand | ApiError>{
        let userInComand = await UserComand.findOne({where: {userId}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let members = await UserComand.findAndCountAll({where:{comandId}})
        if(members.count == 10)
        {
            return ApiError.internal('Команда, в которую вы хотите перейти, полностью укомплектована')
        }
        if(!userInComand)
        {
            return ApiError.internal('Пользователь с таки ID не состоит в команде, вы не можете подать заяку на переход в другую команду')
        }
        if(!comand)
        {
            return ApiError.internal('Данной команды не существует')
        }
        let queue = await requestComand.create({userId, comandId})
        return queue;
    }

    async teamMembers(comandId:number, userLimit:number, offsetStart:number):Promise<Comand[] | ApiError>{
        let teamMembers =await Comand.findAll({
            where:{id:comandId},
            include:[{model:User,attributes: { exclude: ['password']},through:{ attributes:[]}}],
            limit: userLimit,
            offset: offsetStart
        })
        if(teamMembers.length == 0){
            return ApiError.internal('Команда пустая')
        }
        return teamMembers;
    }

    async allMembers(userLimit:number, offsetStart:number):Promise<Comand[] | ApiError>{
        let members = await Comand.findAll({
            include:[{model:User,attributes: { exclude: ['password']}}],
            limit: userLimit,
            offset: offsetStart
        })
        return members;
    }

    async getMember(id:number){
        let member =await User.findOne({where: {id},include:Comand,attributes: { exclude: ['password'] } })
        return member
    }

    async declineQueue(userId:number):Promise<string | ApiError>{
        let user = await requestComand.findOne({where:{userId}})
        if(!user){
            return ApiError.internal('Пользователь с таким ID не состоит в очереди')
        }
        requestComand.destroy({where:{userId}})
        let message = 'Пользователь удален с очереди'
        return message;
    }
}

export default new TeamService()
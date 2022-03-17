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
        let queue = await requestComand.create({userId, comandId})
        return queue;
    }

    async changeComand(userId:number, comandId: number):Promise<requestComand | ApiError>{
        //let user = await Model.requestComand.findOne({where: {userId}})
        let userInComand = await UserComand.findOne({where: {userId}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let members = await UserComand.findAndCountAll({where:{comandId}})
        if(members.count == 10)
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
        let queue = await requestComand.create({userId, comandId})
        return queue;
    }

    async teamMembers(comandId:number):Promise<Comand[] | ApiError>{//UserComand[]
        
        //let member = await UserComand.findOne({where:{userId}})
        //let comandId = member.comandId
        let teamMembers =await Comand.findAll({where:{id:comandId}, include:User})
        if(teamMembers.length == 0){
            return ApiError.internal('Команда пустая')
        }
        return teamMembers;
    }

    async allMembers():Promise<Comand[] | ApiError>{ //UserComand[]
        // let members = await UserComand.findAll()//{include: [User]}
        // if(!members){
        //     return ApiError.internal('Обе команды пусты')
        // }
        // return members;
        let members = await Comand.findAll({include:User})//{include: [User]}
        if(!members){
            return ApiError.internal('Обе команды пусты')
        }
        return members;
    }
    //потом удалить
    async getMember(id:number){
        let member =await User.findOne({where: {id},include:Comand})
        return member
    }
}

export default new TeamService()
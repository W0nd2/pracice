import AproveList from '../models/aprovelistModel';
import Comand from '../models/comandModel';
import requestComand from '../models/requestcomandModel';
import UserComand from '../models/usercomandModel';
import User from '../models/userModel'
import ApiError from '../error/ApiError'

class AdminService {
    // -------- MANAGER --------

    // -------- ADMIN --------

    async confirmManager(id: number, reason: string):Promise<User | ApiError> {
        let user = await User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        if (user.roleId != 2) {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        if (user.managerActive) {
            return ApiError.internal('Пользователь уже являеться MANAGER')
        }
        user.managerActive = true;
        let aprove = await AproveList.findOne({ where: { userId: id } });
        aprove.reason = reason;
        aprove.save()
        user.save()
        return user;
    }

    async declineManager(id: number, reason: string):Promise<User | ApiError>{
        let user = await User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        if (user.roleId != 2) {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        user.managerActive = false;
        user.save()
        return user;
    }

    async getManagerById(id: number):Promise<User | ApiError>{
        let manager = await User.findOne({ where: { id } })
        if (!manager) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        if (manager.roleId != 2) {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        return manager
    }

    async getManagers(roleId: string):Promise<User[]> {
        let managers = await User.findAll({ where: { roleId } })
        return managers;
    }


    // -------- ADMIN --------

    // -------- MANAGER + ADMIN --------

    async getUserById(id: number):Promise<User | ApiError>{
        let user = await User.findOne({ where: { id } })
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
    

    async confirmMemberToAnTeam(userId:number, comandId: number):Promise<UserComand | ApiError>{
        let user = await User.findOne({where:{id:userId}})
        let userInReq = await requestComand.findOne({where: {userId}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let members = await UserComand.findAndCountAll({where:{comandId}})
        console.log(members)
        if(members.count >= 10)
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
        await UserComand.destroy({where:{userId}})                    // удаление пользователя с команды
        let newMember = await UserComand.create({userId, comandId})   // добавление пользователя в новую команду
        await requestComand.destroy({where:{userId}})                 // удаление пользователя из запросов
        return newMember;
    }

    async declineToAnotherTeam(userId:number):Promise<string | ApiError>{
        let user:object = await User.findOne({where:{id:userId}})
        if(!user)
        {
            return ApiError.internal('Пользователя с таки ID не существует')
        }
        let userInReq:object = await requestComand.findOne({where:{userId}})
        
        if(!userInReq)
        {
            return ApiError.internal('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду')
        }
        await requestComand.destroy({where:{userId}})
        const message ='Пользователя не перенесли в другую команду, его заявка отклонена';
        return message;
    }

    //сделать проверку есть ли пользователь в таблице 
    async confirmMember(userId:number, comandId: number):Promise<UserComand | ApiError>{
        let user = await User.findOne({where:{id:userId}})
        let userInReq = await requestComand.findOne({where: {userId}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let members = await UserComand.findAndCountAll({where:{comandId}})
        // console.log('------------')
        // console.log(typeof(members))
        // console.log(members)
        if( await UserComand.findOne({where:{userId}})){
            await requestComand.destroy({where:{userId}})
            return ApiError.internal('Пользователь уже состоит в команде')
        }
        if(members.count >= 10)
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
        
        let newMember = await UserComand.create({userId, comandId})
        await requestComand.destroy({where:{userId}})
        return newMember;
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

    async allQueue():Promise<requestComand[] >{//| ApiError
        let queue = await requestComand.findAll()
        // if(!queue)
        // {
            // return ApiError.internal('Очередь пуста')
        // }
        return queue;
    }

    async getmembers(comandId:number){//:Promise< UserComand[] & counter| ApiError>
        let members = await UserComand.findAndCountAll({where:{comandId}})
        console.log('------------')
        //console.log(typeof(members))
        console.log(members)
        console.log(members.count)
        return members
    }

    // -------- TEAM --------
}

export default new AdminService()
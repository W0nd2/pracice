import AproveList from '../models/aprovelistModel';
import Comand from '../models/comandModel';
import requestComand from '../models/requestcomandModel';
import UserComand from '../models/usercomandModel';
import User from '../models/userModel'
import ApiError from '../error/ApiError'
import Role from '../models/roleModel';

class AdminService {

    async confirmManager(id: number, reason: string):Promise<User | ApiError> {
        let user = await User.findOne({ where: { id },attributes: { exclude: ['password'] }  })
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
        let user = await User.findOne({ where: { id },attributes: { exclude: ['password'] }  })
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
        let manager = await User.findOne({ where: { id },attributes: { exclude: ['password'] }  })
        if (!manager) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        if (manager.roleId != 2) {
            return ApiError.internal('Пользователь не являеться MANAGER')
        }
        return manager
    }

    async getManagers(roleId: string, userLimit:number, offsetStart:number):Promise<User[]> {
        let managers = await User.findAll({ 
            where: { roleId },
            limit: userLimit,
            offset: offsetStart
        })
        return managers;
    }

    async getUserById(id: number):Promise<User | ApiError>{
        let user = await User.findOne({ where: { id },attributes: { exclude: ['password'] } })
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

    async confirmMemberToAnTeam(userId:number, comandId: number):Promise<UserComand | ApiError>{
        let user = await User.findOne({where:{id:userId}})
        let userStatus ='pending';
        let userInReq = await requestComand.findOne({where:{userId,status:userStatus}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let members = await UserComand.findAndCountAll({
            where:{comandId}
        })
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
        if(!comand)
        {
            return ApiError.internal('Данной команды не существует')
        }
        await UserComand.destroy({where:{userId}})                    
        let newMember = await UserComand.create({userId, comandId})   
        userInReq.status = 'approve';
        userInReq.save();              
        return newMember;
    }

    async declineToAnotherTeam(userId:number):Promise<string | ApiError>{
        let user = await User.findOne({where:{id:userId}})
        if(!user)
        {
            return ApiError.internal('Пользователя с таки ID не существует')
        }
        let userStatus ='pending';
        let userInReq = await requestComand.findOne({where:{userId,status:userStatus}})
        if(!userInReq)
        {
            return ApiError.internal('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду')
        }
        userInReq.status = 'decline';
        userInReq.save();
        const message ='Пользователя не перенесли в другую команду, его заявка отклонена';
        return message;
    }
      
    async allQueue(userLimit:number, offsetStart:number):Promise<requestComand[] >{
        let status = 'pending';
        let queue = await requestComand.findAll({
            where: {status},
            include: [
                {model:User,attributes: { exclude: ['password']}},{model:Comand}
            ],
            limit: userLimit,
            offset: offsetStart
        })
        return queue;
    }

    async getmembers(comandId:number,userLimit:number, offsetStart:number):Promise<UserComand[]>{
        let members = await UserComand.findAll({
            where: {comandId},
            include:[{model:User,attributes: { exclude: ['password']},through:{ attributes:[]}}],
            limit: userLimit,
            offset: offsetStart
        })
        return members
    }

    async deleteUserFromTeam(userId:number):Promise<string | ApiError>{
        let message = 'Пользователь был удален с команды'
        let user = await UserComand.destroy({where:{userId}})
        if(!user){
            return ApiError.internal('Пользователя с таки ID не состоит в команде')
        }
        return message;
    }

    async memberToTeam(reqId:number, status:string):Promise<string | ApiError>{
        let userStatus ='pending';
        let request = await requestComand.findOne({where:{id:reqId,status:userStatus}});
        if(!request){
            return ApiError.internal('Пользователя с таки ID не состоит в очереди')
        }
        else if(request.status != 'pending'){
            return ApiError.internal(`Пользователь имеет статус ${request.status}, дальнейшая регистрация не возможна`);
        }
        if(status == 'approve')
        {
            request.status = status;
            request.save();
            await UserComand.create({userId: request.userId, comandId: request.comandId});
            return 'Пользователю одобрили заявку на регистрацию в команду';
        }
        else if(status == 'decline')
        {
            request.status = status;
            request.save();
            return 'Пользователю отклонили заявку на регистрацую в команде';
        }
        else{
            return ApiError.internal(`Не верный статус.`);
        }
    }
}

export default new AdminService()
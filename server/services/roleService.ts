import ApiError from '../error/ApiError';
import Role from "../models/roleModel";

class RoleService{
    async findRole(id:number):Promise<string | ApiError>{
        const role = await Role.findOne({where: {id}})
        if(!role)
        {
            return ApiError.internal('Такой роли не существует')
        }
        return role.userRole
    }
}

export default new RoleService()
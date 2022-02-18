const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../error/ApiError');
import Model from "../models/models";

class RoleService{
    async findRole(id:number){
        const role = await Model.Role.findOne({where: id})
        if(!role)
        {
            return ApiError.internal('Такой роли не существует')
        }
        return role.userRole
    }
}

module.exports = new RoleService()
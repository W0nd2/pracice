import {DataTypes, Model} from 'sequelize' 

import db from '../database'

import User from './userModel'

interface RoleAtributes{
    id:number;
    userRole:string;
}

export default class Role extends Model<RoleAtributes> {
    declare id:number;
    declare userRole:string;
}

Role.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userRole:{type: DataTypes.STRING},
},{
    sequelize: db,
    modelName:'roles'
})

Role.hasMany(User)
User.belongsTo(Role)
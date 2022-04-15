import {DataTypes, Model} from 'sequelize' 

import db from '../database'

interface UserComandAtributes{
    id:number;
    userId:number;
    comandId:number;
}

export default class UserComand extends Model<UserComandAtributes> {
    declare id:number;
    declare userId:number;
    declare comandId:number;
}

UserComand.init({
    id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type:DataTypes.INTEGER},
    comandId:{type:DataTypes.INTEGER}
},{
    sequelize: db,
    modelName:'userComands',
    timestamps:false
})
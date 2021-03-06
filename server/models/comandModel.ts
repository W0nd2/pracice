import {DataTypes, Model} from 'sequelize' 

import db from '../database';
import User from './userModel';
import UserComand from './usercomandModel';
import requestComand from './requestcomandModel';



interface ComandAtributes{
    id:number;
    comandName:string;
}

export default class Comand extends Model<ComandAtributes> {
    declare id:number;
    declare comandName:string;
}

Comand.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    comandName:{type: DataTypes.STRING}
},{
    sequelize: db,
    modelName:'comands',
    timestamps:false
})
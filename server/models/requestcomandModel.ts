import {DataTypes, Model} from 'sequelize' 

import db from '../database'
import Comand from './comandModel';

interface requestComandAtributes{
    id:number;
    userId:number;
    comandId:number;
    status:string;
    type:string;
}

export default class requestComand extends Model<requestComandAtributes> {
    declare id:number;
    declare comandName:string;
    declare status:string;
    declare type:string;
}

requestComand.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type:DataTypes.INTEGER},
    comandId:{type:DataTypes.INTEGER},
    status:{type:DataTypes.STRING, defaultValue:'pending'},
    type:{type:DataTypes.STRING, defaultValue:'join team'}
},{
    sequelize: db,
    modelName:'requestComands',
    timestamps:false
})

Comand.hasOne(requestComand)
requestComand.belongsTo(Comand)
import {DataTypes, Model} from 'sequelize' 

import db from '../database'

interface requestComandAtributes{
    id:number;
    userId:number;
    comandId:number;
}

export default class requestComand extends Model<requestComandAtributes> {
    declare id:number;
    declare comandName:string;
}

requestComand.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type:DataTypes.INTEGER},
    comandId:{type:DataTypes.INTEGER}
},{
    sequelize: db,
    modelName:'requestComands'
})
import {DataTypes, Model} from 'sequelize' 

import db from '../database'


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


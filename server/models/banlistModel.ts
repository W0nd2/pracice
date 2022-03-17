import {DataTypes, Model} from 'sequelize' 

import db from '../database'


interface BanlistAtributes{
    id:number;
    userId:number;
    isBlocked:boolean;
    reason:string;
}

export default class Banlist extends Model<BanlistAtributes> {
    declare id:number;
    declare userId:number;
    declare isBlocked:boolean;
    declare reason:string;
}

Banlist.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type: DataTypes.INTEGER},
    isBlocked:{type: DataTypes.BOOLEAN, defaultValue:"false"},              
    reason:{type: DataTypes.STRING}
},{
    sequelize: db,
    modelName:'banlists'
})
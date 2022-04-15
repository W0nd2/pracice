import {DataTypes, Model} from 'sequelize' 

import db from '../database'


interface AproveListAtributes{
    id:number;
    userId:number;
    reason:string;
}

export default class AproveList extends Model<AproveListAtributes> {
    declare id:number;
    declare userId:number;
    declare reason:string;
}

AproveList.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type: DataTypes.INTEGER},
    reason:{type: DataTypes.STRING}
},{
    sequelize: db,
    modelName:'aprovelists',
    timestamps:false
})
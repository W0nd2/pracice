import {DataTypes, Model} from 'sequelize' 
import db from '../database'

interface TokenAtributes{
    id:number;
    userId:number;
    token:string;
}

export default class Token extends Model<TokenAtributes> {
    declare id:number;
    declare userId:string;
    declare token:string;
}

Token.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type: DataTypes.INTEGER},
    token:{type: DataTypes.STRING},
},{
    sequelize: db,
    modelName:'tokens',
    timestamps:false
})
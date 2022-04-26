import {DataTypes, Model} from 'sequelize' 

import db from '../database'
import Banlist from './banlistModel'
import AproveList from './aprovelistModel'
import requestComand from './requestcomandModel'
import Comand from './comandModel'
import UserComand from './usercomandModel'
import Token from './tokenModel'


interface UserAtributes{
    id:number;
    email :string;
    login:string;                      
    password:string;                     
    avatar:string;                                       
    roleId:number;                       
    accountType:string;
    managerActive:boolean;      
    activationlink:string;
}

export default class User extends Model<UserAtributes> {
    declare id:number;
    declare email :string;
    declare login:string;                      
    declare password:string;                     
    declare avatar:string;                                       
    declare roleId:number;                       
    declare accountType:string;
    declare managerActive:boolean;      
    declare activationlink:string;
    
}

User.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},     
    email:{type: DataTypes.STRING, unique: true},                            
    login:{type: DataTypes.STRING, allowNull: false,},                      
    password:{type: DataTypes.STRING, allowNull: true},                     
    avatar:{type: DataTypes.STRING},                                        
    roleId:{type: DataTypes.INTEGER, defaultValue:1},                       
    accountType:{type: DataTypes.STRING, defaultValue:"common"},
    managerActive:{type: DataTypes.BOOLEAN, defaultValue:"false"},          
    activationlink:{type: DataTypes.STRING},
},{
    sequelize: db,
    modelName:'users',
    timestamps:false
})

User.hasMany(Banlist);
Banlist.belongsTo(User);

User.hasOne(AproveList);
AproveList.belongsTo(User);

User.hasOne(requestComand);
requestComand.belongsTo(User);

User.belongsToMany(Comand,{through: UserComand, foreignKey: 'userId'});
Comand.belongsToMany(User,{through: UserComand, foreignKey: 'comandId'});

User.hasOne(Token);
Token.belongsTo(User);

declare global {
    namespace Express {
        export interface User {
            id: number;
            email: string;
            login: string;
            name:{
                givenName: string,
                familyName: string
            };
        }
    }
}
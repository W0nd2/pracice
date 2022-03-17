"use strict";
//const sequelize = require('../database')
//const {DataTypes} = require('sequelize')
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import db from '../database'
// const User = db.define('user',{
//     id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},     
//     email:{type: DataTypes.STRING, unique: true},                            
//     login:{type: DataTypes.STRING, allowNull: false,},                      
//     password:{type: DataTypes.STRING, allowNull: true},                     
//     avatar:{type: DataTypes.STRING},                                        
//     roleId:{type: DataTypes.INTEGER, defaultValue:1},                       
//     accountType:{type: DataTypes.STRING, defaultValue:"common"},
//     managerActive:{type: DataTypes.BOOLEAN, defaultValue:"false"},          
//     activationlink:{type: DataTypes.STRING},
// })
// const Role = db.define('role',{
//     id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
//     userRole:{type: DataTypes.STRING},
// })
// const Banlist = db.define('banlist',{
//     id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     userId:{type: DataTypes.INTEGER},
//     isBlocked:{type: DataTypes.BOOLEAN, defaultValue:"false"},              
//     reason:{type: DataTypes.STRING}
// })
// const AproveList = db.define('aprovelist',{
//     id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     userId:{type: DataTypes.INTEGER},
//     reason:{type: DataTypes.STRING}
// })
// const Comand = db.define('comand',{
//     id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     comandName:{type: DataTypes.STRING}
// })
// const requestComand = db.define('requestComand',{
//     id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     userId:{type:DataTypes.INTEGER},
//     comandId:{type:DataTypes.INTEGER}
// })
// const UserComand = db.define('userComand',{
//     id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     userId:{type:DataTypes.INTEGER},
//     comandId:{type:DataTypes.INTEGER}
// })
const aprovelistModel_1 = __importDefault(require("./aprovelistModel"));
const banlistModel_1 = __importDefault(require("./banlistModel"));
const comandModel_1 = __importDefault(require("./comandModel"));
const requestcomandModel_1 = __importDefault(require("./requestcomandModel"));
const roleModel_1 = __importDefault(require("./roleModel"));
const usercomandModel_1 = __importDefault(require("./usercomandModel"));
const userModel_1 = __importDefault(require("./userModel"));
//типы связей между таблицами
roleModel_1.default.hasMany(userModel_1.default);
userModel_1.default.belongsTo(roleModel_1.default);
userModel_1.default.hasMany(banlistModel_1.default);
banlistModel_1.default.belongsTo(userModel_1.default);
userModel_1.default.hasOne(aprovelistModel_1.default);
aprovelistModel_1.default.belongsTo(userModel_1.default);
userModel_1.default.hasOne(requestcomandModel_1.default);
requestcomandModel_1.default.belongsTo(userModel_1.default);
userModel_1.default.belongsToMany(comandModel_1.default, { through: usercomandModel_1.default });
comandModel_1.default.belongsToMany(userModel_1.default, { through: usercomandModel_1.default });
// export default  {
//     User, Role, Banlist,  Comand, requestComand, AproveList, UserComand, 
// }
// declare global {
//     namespace Express {
//         export interface User {
//             id: number;
//             email: string;
//             login: string;
//         }
//     }
// }
//# sourceMappingURL=models.js.map

const sequelize = require('../database')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},    // id сделать авточислом
    email:{type: DataTypes.STRING, unique: true},                           // для отправки писем для востановления пароля
    login:{type: DataTypes.STRING, allowNull: false,},                      // для отображение на сайте
    password:{type: DataTypes.STRING, allowNull: true},                     //
    avatar:{type: DataTypes.STRING},                                        // ава человека, посмотреть как работать с файлами для коректного вывода и заполненем их в базе данных
    //comandId:{type: DataTypes.INTEGER},                                     // команду в которую он подал заявку
    roleId:{type: DataTypes.INTEGER, defaultValue:1},                       // роль на сайте
    accountType:{type: DataTypes.STRING, defaultValue:"common"},
    //убрать поле блокировки и потом сравнивать по таблице блокировки
    //isBlocked:{type: DataTypes.BOOLEAN, defaultValue:"false"},              // поле блокировки
    //reasonBlock:{type: DataTypes.INTEGER},                                  // поле с указанием причин(ы)
    //reasonUnblock:{type: DataTypes.STRING},                                 // поле с указанием причины разблокировки
    managerActive:{type: DataTypes.BOOLEAN, defaultValue:"false"},          // активен ли аккаунт менеджера или нет
    //aproveRes:{type: DataTypes.INTEGER},                                    // 
    activationlink:{type: DataTypes.STRING},                                //ссылка на активацию
    
    //
    //
    //  заменить роль на айди роли из таблицы роль
    //  брать причину бана из бан-листа
    //  наверное добавить поле в котором будет храниться ссылка на запрос забыл пароль, потом пересмотреть смену пароля
})


const Role = sequelize.define('role',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    userRole:{type: DataTypes.STRING},
    //userId:{type:DataTypes.INTEGER}
})

//бан-лист

const Banlist = sequelize.define('banlist',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type: DataTypes.INTEGER},
    isBlocked:{type: DataTypes.BOOLEAN, defaultValue:"false"},              // поле блокировки
    //при разблокировке брать и чистить поле бана
    reason:{type: DataTypes.STRING}
    //добавить поле блокировки

})

//удалить
// const UnBanlist = sequelize.define('unbanlist',{
//     id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     userId:{type: DataTypes.INTEGER},
//     reason:{type: DataTypes.STRING}
// })

const AproveList = sequelize.define('aprovelist',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type: DataTypes.INTEGER},
    reason:{type: DataTypes.STRING}
})

//сделать таблицу для команд(подумать над тем как реализовать связи)
const Comand = sequelize.define('comand',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    comandName:{type: DataTypes.STRING}
})

// тут будет список людей которые подали заявку на встепление в группу 
const requestComand = sequelize.define('requestComand',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type:DataTypes.INTEGER},
    comandId:{type:DataTypes.INTEGER}
})


// промежуточная таблица

const UserComand = sequelize.define('userComand',{
    id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId:{type:DataTypes.INTEGER},
    comandId:{type:DataTypes.INTEGER}
})



//типы связей между таблицами
Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Banlist)
Banlist.belongsTo(User)

//User.hasMany(UnBanlist)
//UnBanlist.belongsTo(User)

User.hasOne(AproveList)
AproveList.belongsTo(User)

User.hasOne(requestComand)
requestComand.belongsTo(User)

//возможно надо сделать связь много к многим с таблицей юзеров
User.belongsToMany(Comand,{through: UserComand})
Comand.belongsToMany(User,{through: UserComand})

export default module.exports = {
    User, Role, Banlist,  Comand, requestComand, AproveList, UserComand, //UnBanlist
}
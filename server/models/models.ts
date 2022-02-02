const sequelize = require('../database')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},    // id сделать авточислом
    email:{type: DataTypes.STRING, unique: true},                           // для отправки писем для востановления пароля
    login:{type: DataTypes.STRING, allowNull: false},                       // для отображение на сайте
    password:{type: DataTypes.STRING, allowNull: false},                    //
    avatar:{type: DataTypes.STRING},                                        // ава человека, посмотреть как работать с файлами для коректного вывода и заполненем их в базе данных
    comandId:{type: DataTypes.INTEGER},                                     // команду в которую он подал заявку
    role:{type: DataTypes.STRING, defaultValue:"USER"}                      // роль на сайте
})

//сделать таблицу для команд(подумать над тем как реализовать связи)


//типы связей между таблицами


// export в дальнейшем будет больше таблиц и наверное надо будет возвращать обдж
module.exports = {
    User
}
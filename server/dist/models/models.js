const sequelize = require('../database');
const { DataTypes } = require('sequelize');
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    login: { type: DataTypes.STRING, allowNull: false, },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING },
    comandId: { type: DataTypes.INTEGER },
    role: { type: DataTypes.STRING, defaultValue: "USER" } // роль на сайте
});
//сделать таблицу для команд(подумать над тем как реализовать связи)
//типы связей между таблицами
// export в дальнейшем будет больше таблиц и наверное надо будет возвращать обдж
module.exports = {
    User
};
//# sourceMappingURL=models.js.map
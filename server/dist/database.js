"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
});
exports.default = db;
//# sourceMappingURL=database.js.map
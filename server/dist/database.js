"use strict";
// const {Sequelize} = require('sequelize')
Object.defineProperty(exports, "__esModule", { value: true });
// module.exports = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect: 'postgres',
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT
//     }
// )
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize(
// process.env.DB_NAME,
// process.env.DB_USER,
// process.env.DB_PASSWORD,
// {
//     dialect: 'postgres',
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT)
// }
{
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'postgres',
});
exports.default = db;
//# sourceMappingURL=database.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const express_session_1 = __importDefault(require("express-session"));
const database_1 = __importDefault(require("./database"));
const SequelizeStore = (0, connect_session_sequelize_1.default)(express_session_1.default.Store);
const sessionStore = new SequelizeStore({
    db: database_1.default,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 1000 * 60 * 60
});
exports.default = sessionStore;
//# sourceMappingURL=session.js.map
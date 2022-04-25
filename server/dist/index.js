"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const index_1 = __importDefault(require("./routes/index"));
const ErrorHandlingMidleware_1 = __importDefault(require("./middleware/ErrorHandlingMidleware"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
require("./pasportStrategy");
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const express_session_1 = __importDefault(require("express-session"));
require("./socket/appSocket");
const SequelizeStore = (0, connect_session_sequelize_1.default)(express_session_1.default.Store);
const SESSION_SECRET = 'secret';
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: SESSION_SECRET,
    store: new SequelizeStore({
        db: database_1.default,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 1000 * 60 * 60
    }),
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.resolve(__dirname, 'views')));
app.use(express_1.default.static(path_1.default.resolve(__dirname, 'static'))); //для рендера картинок 
app.use((0, express_fileupload_1.default)({}));
app.use('/api', index_1.default);
//последний в цепочке Middleware, отвечает за ошибки
app.use(ErrorHandlingMidleware_1.default);
exports.default = app;
const start = async () => {
    try {
        await database_1.default.authenticate();
        await database_1.default.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
//# sourceMappingURL=index.js.map
require('dotenv').config();
import express from 'express';
const sequelize = require('./database');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMidleware');
const path = require('path');
const sessionStore = require('./session');

const passport = require('passport');
import './pasportStrategy';



import connect from 'connect-session-sequelize';
import session from 'express-session';
const SequelizeStore = connect(session.Store);

const SESSION_SECRET =  'secret';
const PORT = process.env.PORT || 5000;
const app = express();

app.use(session({
    secret: SESSION_SECRET,
    store:  new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15*60*1000,
        expiration: 1000 * 60* 60
    }),
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(cors())
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, 'static')))//для рендера картинок 
app.use(fileUpload({}))
app.use('/api', router)

//последний в цепочке Middleware, отвечает за ошибки
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
require('dotenv').config();
import express from 'express';
import db from './database';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandlingMidleware';
import path from 'path';
import passport from 'passport';
import './pasportStrategy';
import connect from 'connect-session-sequelize';
import session from 'express-session';
import './socket/appSocket';
const SequelizeStore = connect(session.Store);

const SESSION_SECRET =  'secret';
const PORT = process.env.PORT || 5000;
const app = express();

app.use(session({
    secret: SESSION_SECRET,
    store:  new SequelizeStore({
        db: db,
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
app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, 'views')))
app.use(express.static(path.resolve(__dirname, 'static')))//для рендера картинок 
app.use(fileUpload({}))
app.use('/api', router)
//последний в цепочке Middleware, отвечает за ошибки
app.use(errorHandler)

// import Rout, {Request,Response} from 'express'
// app.get('/index', (req:Request,res:Response)=>{
//     res.render('index')
// })

export default app;

const start = async () => {
    try {
        await db.authenticate()
        await db.sync()
        app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
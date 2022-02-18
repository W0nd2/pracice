import connect from 'connect-session-sequelize';
import session from 'express-session';
const dataBase = require('./database')
const SequelizeStore = connect(session.Store);

const sessionStore = new SequelizeStore({
    db: dataBase,
    checkExpirationInterval: 15*60*1000,
    expiration: 1000 * 60* 60
});

export default sessionStore;
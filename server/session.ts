import connect from 'connect-session-sequelize';
import session from 'express-session';
import db from './database'
const SequelizeStore = connect(session.Store);

const sessionStore = new SequelizeStore({
    db: db,
    checkExpirationInterval: 15*60*1000,
    expiration: 1000 * 60* 60
});

export default sessionStore;
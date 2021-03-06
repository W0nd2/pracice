import {Sequelize} from 'sequelize'

const db = new Sequelize (
    {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: String(process.env.DB_PASSWORD),
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging:false
    }
)

export default db;
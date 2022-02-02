require('dotenv').config()
import express from 'express'
const sequelize = require('./database')
const models = require('./models/models')



const PORT = process.env.PORT || 5000;

const app = express();

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
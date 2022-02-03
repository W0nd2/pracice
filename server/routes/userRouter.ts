const Rout = require('express')
const userRoutes = new Rout()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

userRoutes.post('/login',userController.login)
userRoutes.post('/registration',userController.registration)
userRoutes.get('/auth', authMiddleware ,userController.checkJwt)



module.exports = userRoutes
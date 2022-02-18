const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const adminRouter = require('./adminRouter')
const authRouter = require('./authRouter')

// AUTH
router.use('/auth', authRouter)

// USER
router.use('/user',userRouter);

//ADMIN + MANAGER
router.use('/admin',adminRouter);

module.exports = router
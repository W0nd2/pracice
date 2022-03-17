const Router = require('express')
const router = new Router()
import userRouter from './userRouter'
import adminRouter from './adminRouter'
import authRouter from './authRouter'

// AUTH
router.use('/auth', authRouter)

// USER
router.use('/user',userRouter);

//ADMIN + MANAGER
router.use('/admin',adminRouter);

export default router
const Router = require('express')
const router = new Router()
import userRouter from './userRouter'
import adminRouter from './adminRouter'
import authRouter from './authRouter'
import renderRoter from './renderRouter'

// AUTH
router.use('/auth', authRouter)

// USER
router.use('/user',userRouter);

//ADMIN + MANAGER
router.use('/admin',adminRouter);

router.use('/render', renderRoter);

export default router
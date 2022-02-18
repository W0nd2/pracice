const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
router.use('/user', userRouter);
//возможно для админа и модератора сделать отдельные роуты, где будут проверки на роли
module.exports = router;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require('express');
const router = new Router();
const userRouter_1 = __importDefault(require("./userRouter"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
// AUTH
router.use('/auth', authRouter_1.default);
// USER
router.use('/user', userRouter_1.default);
//ADMIN + MANAGER
router.use('/admin', adminRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
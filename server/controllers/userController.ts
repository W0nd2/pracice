import * as express from 'express';
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const {User} = require('../models/models');
const jwt = require('jsonwebtoken')

const genereteJwt = (id:number, email:string, login:string, role:string) =>{
    return jwt.sign(
        {id, email, login, role},//payload
        process.env.SECRET_KEY,
        {expiresIn:'12h'}
    )
}

class UserController{
    async registration(req: express.Request, res: express.Response, next:express.NextFunction){
        const{email,password,login,role} = req.body
        if(!email || !password){
            return next(ApiError.bedRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where:{email}})
        if(candidate){
            return next(ApiError.bedRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password,5);
        const user = await User.create({email, password:hashPassword,login, role}) 
        const token = genereteJwt(user.id,user.email,user.login,user.role)
        return res.json(token);
    }

    async login(req: express.Request, res: express.Response, next:express.NextFunction){
        const{email,password} = req.body;
        const user = await User.findOne({where:{email}})
        if(!user)
        {
            return next(ApiError.internal('Пользователя с таким email не существует'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword)
        {
            return next(ApiError.internal('Неверный пароль'))
        }
        const token = genereteJwt(user.id,user.email,user.login,user.role)
        return res.json(token);
    }

    async checkJwt(req: express.Request, res: express.Response, next:express.NextFunction){
        const{id, email, login, role} = req.body
        const token = genereteJwt(id, email, login, role);
        res.json({token})
    }

}

module.exports = new UserController()
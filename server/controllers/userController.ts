import * as express from 'express';
import { validationResult } from 'express-validator';
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const { Role, Comand } = require('../models/models');
//const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const jwtService = require('../services/jwtService')

class UserController {
    // после того как будет все готово убрать
    async roleCreate(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            const{newRole} = req.body
            const role = await Role.create({userRole:newRole})
            return res.json({role})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async comandAdd(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            console.log('kokoko')
            const{newComand} = req.body
            const comand = await Comand.create({comandName:newComand})
            return res.json({comand})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }
    //-------------------------------------------------------------------------------------------------------
    

    // PROFILE

    async checkProfile(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {id} = jwtService.decodeJWT(req.headers.authorization.split(' ')[1])
            let user = await userService.checkProfile(id)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }


    // USER LOGIN

    async changeLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            //тут менял айди перенести в рек боди если не будет работать
            const {id} = jwtService.decodeJWT(req.headers.authorization.split(' ')[1])
            const { newLogin } = req.body;
            console.log(id, newLogin)
            let user = await userService.changeLogin(id, newLogin)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // AVATAR

    async changeAvatar(req: any, res: any, next: any) {
        try {
            const {id} = jwtService.decodeJWT(req.headers.authorization.split(' ')[1])
            const {avatar} = req.files;
            let fileName = uuid.v4() + ".jpg";
            avatar.mv(path.resolve(__dirname, '..', 'static', fileName))
            let user = await userService.changeAvatar(id,fileName)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }


    // PASSWORD
    // пересмотреть когда добавлю поле с ссылкой на смену пароля
    async changePassword(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            const {email} = req.body;
            console.log(email)
            await userService.changePassword(email)
            return res.json({message:'Письмо отправлено на почту'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // возможно не надо делать

    async forgotPassport(req: express.Request, res: express.Response, next: express.NextFunction){//не работает
        console.log('Working')
        // try {
        //     const errors = validationResult(req)
        //     if(!errors.isEmpty())
        //     {
        //         return res.status(400).json({errors});
        //     }
        //     const {id, newPassword} = req.body;
        //     let user = await userService.forgotPassword(id, newPassword)
        //     let role = await roleService.findRole(user.roleId)
        //     let token = genereteJwt(user.id, user.email, user.login, role)
        //     return res.json({token});
        // } catch (error) {
        //     console.log(error)
        //     return res.status(500).json({ message: 'Error' });
        // }




        // try {
        //     const{email} = req.body;
        //     let user = await User.findOne({where:{email}})
        //     if (!user) {
        //         return next(ApiError.internal('Пользователя с таким email не существует'))
        //     }
        //      //bcrypt.decoded(user.password);
        //     const password = user.password
        //     console.log( password)
        //     //спросить за расхеширование пароля или как реализовать функцию восстановления пароля
        //     return res.json({message:"working"})
        // } catch (error) {
        //     console.log(error)
        //     return res.status(500).json({ message: 'Error' });
        // }
    }

    // -------- USER --------
}

module.exports = new UserController()
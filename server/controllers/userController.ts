import * as express from 'express';
import { validationResult } from 'express-validator';
import Role from '../models/roleModel';
import Comand from '../models/comandModel';
import ApiError from '../error/ApiError';
import userService from '../services/userService';
import fileService from '../services/fileService';

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
            return ApiError.internal(error);
        }
    }

    async comandAdd(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            const{newComand} = req.body
            const comand = await Comand.create({comandName:newComand})
            return res.json({comand})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }
    //-----

    async checkProfile(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const id = req.user.id
            if(!id)
            {
                return ApiError.internal('Пользователь не авторизирован');
            }
            let user = await userService.checkProfile(id)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async changeLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json(errors);
            }
            const id = req.user.id
            if(!id)
            {
                return ApiError.internal('Пользователь не авторизирован');
            }
            const { newLogin } = req.body;
            let user = await userService.changeLogin(id, newLogin)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async changeAvatar(req: express.Request ,res: express.Response, next: express.NextFunction) {
        try {
            const id = req.user.id
            if(!id)
            {
                return ApiError.internal('Пользователь не авторизирован');
            }
            const {avatar} = req.files;
            let fileName = fileService.uploadFile(avatar)
            let user = await userService.changeAvatar(id,fileName)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }
    
    async changePassword(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json(errors);
            }
            let {email} = req.body;
            let message = await userService.changePassword(email)
            return res.json({message})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }


    async forgotPassword(req: express.Request, res: express.Response, next: express.NextFunction){//не работает
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json(errors);
            }
            const id = req.user?.id
            if(!id)
            {
                return ApiError.internal('Пользователь не подавал заявку на смену пароля');
            }
            const {password, token} = req.body
            let message = await userService.forgotPassword(password, token);
            return res.json({message})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }
}

export default new UserController()
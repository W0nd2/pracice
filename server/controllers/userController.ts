import * as express from 'express';
import { validationResult } from 'express-validator';
import Role from '../models/roleModel';
import Comand from '../models/comandModel';
import ApiError from '../error/ApiError';
import userService from '../services/userService';
import fileService from '../services/fileService';

// declare global {
//     namespace Express {
//         export interface User {
//             id: number;
//             email: string;
//             login: string;
//         }
//     }
// }

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
    //-------------------------------------------------------------------------------------------------------
    

    // PROFILE

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


    // USER LOGIN

    async changeLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            const id = req.user.id
            if(!id)
            {
                return ApiError.internal('Пользователь не авторизирован');
            }
            const { newLogin } = req.body;
            console.log(id, newLogin)
            let user = await userService.changeLogin(id, newLogin)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // AVATAR

    async changeAvatar(req: express.Request ,res: express.Response, next: express.NextFunction) {
        try {
            const id = req.user.id
            if(!id)
            {
                return ApiError.internal('Пользователь не авторизирован');
            }
            const {avatar} = req.files;
            console.log('------------------------------------------------------')
            console.log(typeof(avatar))
            //let fileName = uuid.v4() + ".jpg";
            //avatar.mv(path.resolve(__dirname, '..', 'static', fileName))
            let fileName = fileService.uploadFile(avatar)
            let user = await userService.changeAvatar(id,fileName)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }


    // PASSWORD
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
            return ApiError.internal(error);
        }
    }


    async forgotPassword(req: express.Request, res: express.Response, next: express.NextFunction){//не работает
        try {
            const id = req.user?.id
            if(!id)
            {
                return ApiError.internal('Пользователь не авторизирован');
            }
            const {password} = req.body
            return(userService.forgotPassword(id,password))
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // -------- USER --------
}

export default new UserController()
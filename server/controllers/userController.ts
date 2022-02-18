import * as express from 'express';
import { validationResult } from 'express-validator';
import { Model } from 'sequelize/dist';
import { json } from 'stream/consumers';
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../error/ApiError');
const { User, Role, Comand } = require('../models/models');
//const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const genereteJwt = require('../services/jwtService')
const roleService = require('../services/roleService')
const blockService = require('../services/blockService')

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

    // -------- AUTH --------

    async registration(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { email, password, login, role } = req.body
            
            
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            if (!email || !password) {
                return next(ApiError.bedRequest('Некорректный email или password'))
            }
            let user = await userService.registration(email, password, login, role)
            return res.json(user);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }

    }

    async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { email, password } = req.body;
            console.log(req.body)
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            let user = await userService.login(email, password)
            console.log(user)
            if(user instanceof ApiError)
            {
                return res.json(user)
            }
            let role = await roleService.findRole(user.roleId)
            
            let token = genereteJwt(user.id, user.email, user.login, role)
            return res.json({token});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }

    }

    async checkJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id, email, login, role } = req.body
            const token = genereteJwt(id, email, login, role);
            return res.json({ token })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }

    }

    //     Start  -------    Google auth     -------  Start
    async successGoogleAuth(req: any, res: any, next: any) {
        try {
            console.log(req.user);
            const { email, name } = req.user;
            let user = await userService.googleAuth(email, name.givenName)
            const token = genereteJwt(user.id, user.email, user.login, user.role)
            return res.json({ token })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error google auth' });
        }
    }

    async failureGoogleAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        return res.status(500).json({ message: "Failure login" })
    }

    async loginGoogle(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { email } = req.body;
            let user = await userService.loginGoogle(email);
            let role = await roleService.findRole(user.roleId)
            const token = genereteJwt(user.id, user.email, user.login, role)
            return res.json({token});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async logoutGoogle(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.session.destroy(() => { });
        return res.json({ message: 'Logged out Google Account' })
    }

    //     END  -------    Google auth     -------  END

    // -------- AUTH --------

    // -------- USER --------

    // PROFILE

    async checkProfile(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id} = req.body
            //брать айди с токена
            //
            //
            //
            //
            //
            //
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
            //брать айди с токена
            //
            //
            //
            //
            //
            //
            const { id, newLogin } = req.body;
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
            //брать айди с токена
            //
            //
            //
            //
            //
            //
            const{id} = req.body;
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

    // ROLE
    // async checkRole(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     try {
    //         const { email } = req.body;
    //         const user = await User.findOne({ where: { email } })
    //         if (!user) {
    //             return next(ApiError.internal('Пользователя с таким email не существует'))
    //         }
    //         const role = user.role;
    //         return res.json({ role })
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ message: 'Error' });
    //     }
    // }

    // // TEAM
    // async checkTeam(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     return res.json({ message: 'Пока не реализовал команды' })
    // }

    // PASSWORD
    // пересмотреть когда добавлю поле с ссылкой на смену пароля
    async changePassword(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            //брать айди с токена
            //
            //
            //
            //
            //
            //
            const {id} = req.body;
            await userService.changePassword(id)
            return res.json({message:'Working !!'})
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

    // -------- MANAGER --------

    async loginManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            const{email, password} = req.body;
            let user = await userService.loginManager(email,password)
            let role = await roleService.findRole(user.roleId)
            
            let token = genereteJwt(user.id, user.email, user.login, role)
            return res.json({token});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // -------- MANAGER --------

    // -------- ADMIN --------

    async confirmManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body //или ID
            let user = await userService.confirmManager(id,reason)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async declineManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body //или ID
            let user = await userService.declineManager(id,reason)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async getManagerById(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id} = req.body
            let manager = await userService.getManagerById(id)
            return res.json(manager)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async getManagers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{role} = req.body
            let managers = await userService.getManagers(role);
            return res.json(managers)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async blockUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body
            let block = await blockService.blockUser(Number(id),reason)
            //let user = await userService.blockUser();
            return res.json(block)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async unblockUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body
            let block = await blockService.unBlockUser(Number(id))
            //let user = await userService.unblockUser(id,reason)
            return res.json(block)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // -------- ADMIN --------

    // -------- MANAGER + ADMIN --------
    
    async getUserById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.body;
            let user = await userService.getUserById(id)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // -------- MANAGER + ADMIN --------




    // -------- TEAM --------

    // ОТПРАВКА ЗАЯВКИ НА ВСТУПЛЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    async newTeamMember(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            //брать айди с токена
            //
            //
            //
            //
            //
            //
            const{id,comandId} = req.body;
            let result = await userService.newMember(id,comandId)
            return res.json({result})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // ОТМЕНА ЗАЯВКИ НА ВСТУПЛНЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    async declineQueue(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId} = req.body;
            //брать айди с токена
            //
            //
            //
            //
            //
            //
            let queue = await userService.declineQueue(userId)
            return res.json({message:`Пользователь ${userId} удален с очереди`, queue})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // Переход в другую каманду
    async changeComand(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
           const{userId,comandId} = req.body
           //брать айди с токена
            //
            //
            //
            //
            //
            //
            let queue = await userService.changeComand(userId, comandId)
            return res.json(queue)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async confirmToAnotherTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        const{userId, comandId} = req.body
        let newTeamMember = await userService.confirmMemberToAnTeam(userId, comandId)
        return res.json(newTeamMember)
    }

    async declineToAnotherTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        const{userId, comandId} = req.body
        let newTeamMember = await userService.declineToAnotherTeam(userId)
        return res.json({message:"Пользователь был удален из очереди и не перенесен в другую команду"})
        //возможно просто переделать таблицу чтобы было поле с данными что пользователь уже состоит в команде
    }

    async confirmMember(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId, comandId} = req.body;
            let newTeamMember = await userService.confirmMember(userId, comandId)
            return res.json(newTeamMember)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // ОТМЕНА ЗАЯВКИ НА ВСТУПЛЕНИЕ В КОМАНДУ АДМИНИСТРАТОРОМ
    async declineByManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId} = req.body;
            
            let queue = await userService.declineQueue(userId)
            return res.json({message:`Пользователь ${userId} удален с очереди менеджером`, queue})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // ПОЛУЧИТЬ ВСЕХ УЧАСНИКОВ КОТОРІЕ ПРИНЯЛИ ЗАЯВКИ
    async getqueue(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            let queue = await userService.allQueue()
            return res.json({queue})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }


    //ИНФОРМАЦИЯ ПРО ИГРОКОВ В ОДНОЙ КОМАНДЕ
    async teamMembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{comandId} = req.body;
            let team = await userService.teamMembers(comandId)
            return res.json({team})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // ВСЕ УЧАСНИКИ С ДВУХ КОМАНД
    async allMembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            let teams = await userService.allMembers()
            return res.json({teams})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }
    // -------- TEAM --------
}

module.exports = new UserController()
import * as express from 'express';
import { validationResult } from 'express-validator';
//const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const adminService = require('../services/adminService')
const jwtService = require('../services/jwtService')
const roleService = require('../services/roleService')
const blockService = require('../services/blockService')

class AdminController{
    // -------- MANAGER --------

    async loginManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors});
            }
            const{email, password} = req.body;
            let user = await adminService.loginManager(email,password)
            let role = await roleService.findRole(user.roleId)
            
            let token = jwtService.genereteJwt(user.id, user.email, user.login, role)
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
            let user = await adminService.confirmManager(id,reason)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async declineManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body //или ID
            let user = await adminService.declineManager(id,reason)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async getManagerById(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id} = req.body
            let manager = await adminService.getManagerById(id)
            return res.json(manager)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    async getManagers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{role} = req.body
            let managers = await adminService.getManagers(role);
            return res.json(managers)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // поменять немного запрос
    async blockUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason,blockFlag} = req.body
            let block = await blockService.blockUser(Number(id),reason,blockFlag)
            //let block = await blockService.blockUser(Number(id),reason)
            return res.json(block)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // поменять немного запрос
    async unblockUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason,blockFlag} = req.body
            let block = await blockService.blockUser(Number(id),reason,blockFlag)
            //let block = await blockService.unBlockUser(Number(id))
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
            let user = await adminService.getUserById(id)
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // -------- MANAGER + ADMIN --------


    // -------- TEAM --------

    async confirmToAnotherTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        const{userId, comandId} = req.body
        let newTeamMember = await adminService.confirmMemberToAnTeam(userId, comandId)
        return res.json(newTeamMember)
    }

    async declineToAnotherTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        const{userId, comandId} = req.body
        let newTeamMember = await adminService.declineToAnotherTeam(userId)
        return res.json({message:"Пользователь был удален из очереди и не перенесен в другую команду"})
        //возможно просто переделать таблицу чтобы было поле с данными что пользователь уже состоит в команде
    }

    async confirmMember(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId, comandId} = req.body;
            let newTeamMember = await adminService.confirmMember(userId, comandId)
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
            
            let queue = await adminService.declineQueue(userId)
            return res.json({message:`Пользователь ${userId} удален с очереди менеджером`, queue})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // ПОЛУЧИТЬ ВСЕХ УЧАСНИКОВ КОТОРЫЕ ОТПРАВИЛИ ЗАЯВКИ
    async getqueue(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            let queue = await adminService.allQueue()
            return res.json({queue})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // -------- TEAM --------

}

module.exports = new AdminController()
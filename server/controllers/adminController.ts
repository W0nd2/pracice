import * as express from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../error/ApiError';
import adminService from '../services/adminService';
import jwtService from '../services/jwtService';
import roleService from '../services/roleService';
import blockService from '../services/blockService';

class AdminController{


    
    // -------- MANAGER --------
 
    // -------- MANAGER --------

    // -------- ADMIN --------

    async confirmManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body //или ID
            let user = await adminService.confirmManager(id,reason)
            if(user instanceof ApiError)
            {
                return res.status(500).json(user);
            }
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async declineManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body //или ID
            let user = await adminService.declineManager(id,reason)
            if(user instanceof ApiError)
            {
                return res.status(500).json(user);
            }
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async getManagerById(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id} = req.query
            //console.log(id)
            let manager = await adminService.getManagerById(Number(id))
            if(manager instanceof ApiError)
            {
                return res.status(400).json(manager)
            }
            return res.json(manager)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async getManagers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const roleId = 2
            // console.log(roleId)
            let managers = await adminService.getManagers(String(roleId));
            return res.json(managers)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // поменять немного запрос
    async blockUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason,blockFlag} = req.body
            let block = await blockService.blockUser(Number(id),reason,blockFlag)
            if(block instanceof ApiError)
            {
                return res.status(500).json(block)
            }
            //let block = await blockService.blockUser(Number(id),reason)
            return res.json(block)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // -------- ADMIN --------

    // -------- MANAGER + ADMIN --------
    
    async getUserById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.query;
            let user = await adminService.getUserById(Number(id))
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // -------- MANAGER + ADMIN --------


    // -------- TEAM --------

    async confirmToAnotherTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId, comandId} = req.body
            let newTeamMember = await adminService.confirmMemberToAnTeam(userId, comandId)
            return res.json(newTeamMember)
        } catch (error) {
            console.log(error)
            ApiError.internal(error)
        }
    }

    async declineToAnotherTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId, comandId} = req.body
            let newTeamMember = await adminService.declineToAnotherTeam(userId)
            return res.json({message:"Пользователь был удален из очереди и не перенесен в другую команду"})
            //возможно просто переделать таблицу чтобы было поле с данными что пользователь уже состоит в команде
        } catch (error) {
            console.log(error)
            ApiError.internal(error)
        }
        
    }

    async confirmMember(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId, comandId} = req.body;
            let newTeamMember = await adminService.confirmMember(userId, comandId);
            if(newTeamMember instanceof ApiError){
                return res.status(500).json(newTeamMember);
            }
            return res.json(newTeamMember);
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // ОТМЕНА ЗАЯВКИ НА ВСТУПЛЕНИЕ В КОМАНДУ АДМИНИСТРАТОРОМ
    async declineByManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{userId} = req.body;
            
            let queue = await adminService.declineQueue(userId);
            if(queue instanceof ApiError)
            {
                return res.status(500).json(queue);
            }
            return res.json({message:`Пользователь ${userId} удален с очереди менеджером`, queue});
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
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
            return ApiError.internal(error);
        }
    }


    async getmembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {id} = req.body;
            const members = adminService.getmembers(id)
            return res.json(members)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }
    // -------- TEAM --------

}

export default new AdminController()
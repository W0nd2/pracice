import * as express from 'express';
import ApiError from '../error/ApiError';
import adminService from '../services/adminService';
import blockService from '../services/blockService';

class AdminController{
    async confirmManager(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason} = req.body
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
            const{id,reason} = req.body
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
            const {userLimit, offsetStart} = req.query
            const roleId = 2
            let managers = await adminService.getManagers(String(roleId),Number(userLimit), Number(offsetStart));
            return res.json(managers)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async blockUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const{id,reason,blockFlag} = req.body
            let block = await blockService.blockUser(Number(id),reason,blockFlag)
            if(block instanceof ApiError)
            {
                return res.status(500).json(block)
            }
            return res.json(block)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }
    
    async getUserById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.query;
            let user = await adminService.getUserById(Number(id))
            if(user instanceof ApiError)
            {
                return res.status(400).json(user);
            }
            delete user.password
            return res.json(user)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async confirmToAnotherTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            
            const{userId, comandId} = req.body;
            let newTeamMember = await adminService.confirmMemberToAnTeam(userId, comandId);
            return res.json(newTeamMember);
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
        } catch (error) {
            console.log(error)
            ApiError.internal(error)
        }
        
    }

    

    // ПОЛУЧИТЬ ВСЕХ УЧАСНИКОВ КОТОРЫЕ ОТПРАВИЛИ ЗАЯВКИ
    async getqueue(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            const {userLimit, offsetStart} = req.query;
            let queue = await adminService.allQueue(Number(userLimit), Number(offsetStart))
            return res.json({queue,total: queue.length})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }


    async getmembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {userLimit, offsetStart} = req.query;
            const {id} = req.body;
            const members = await adminService.getmembers(id,Number(userLimit), Number(offsetStart))
            return res.json({members,total:members.length})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async deleteUserFromTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {userId} = req.body;
            const message = await adminService.deleteUserFromTeam(userId)
            return res.json({message})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async memberToTeam(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {reqId, status} = req.body;
            const message = await adminService.memberToTeam(reqId, status);
            if(message instanceof ApiError){
                return res.status(400).json(message);
            }
            return res.json({message})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }
}

export default new AdminController()
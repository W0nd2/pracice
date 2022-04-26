import * as express from 'express';
import ApiError from'../error/ApiError';
import teamService from '../services/teamService';

class TeamController{
    // -------- TEAM --------

    // ОТПРАВКА ЗАЯВКИ НА ВСТУПЛЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    async newTeamMember(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            const id = req.user.id
            const{comandId} = req.body;
            let result = await teamService.newMember(id,comandId)
            if(result instanceof ApiError)
            {
                return res.status(400).json(result)
            }
            return res.json(result)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // ОТМЕНА ЗАЯВКИ НА ВСТУПЛНЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    async declineQueue(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const id = req.user.id
            let queue = await teamService.declineQueue(id)
            return res.json({message:`Пользователь ${id} удален с очереди`, queue})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // Переход в другую каманду
    async changeComand(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const id = req.user.id
            const{comandId} = req.body
            let queue = await teamService.changeComand(id, comandId)
            return res.json(queue)
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    //ИНФОРМАЦИЯ ПРО ИГРОКОВ В ОДНОЙ КОМАНДЕ
    async teamMembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {comandId,userLimit, offsetStart} = req.query;
            let team = await teamService.teamMembers(Number(comandId),Number(userLimit), Number(offsetStart))
            if(team instanceof ApiError)
            {
                return res.status(400).json(team)
            }
            return res.json({team})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    // ВСЕ УЧАСНИКИ С ДВУХ КОМАНД
    async allMembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {userLimit, offsetStart} = req.query;
            let teams = await teamService.allMembers(Number(userLimit), Number(offsetStart))
            if(teams instanceof ApiError){
                return res.status(400).json(ApiError);
            }
            return res.json({teams,total:teams.length})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async getMember(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            let userId = req.user.id
            let teams = await teamService.getMember(userId)
            return res.json({teams})
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }
}

export default new TeamController()
import * as express from 'express';
//const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const teamService = require('../services/teamService')
const jwtService =require('../services/jwtService')

class TeamController{
    // -------- TEAM --------

    // ОТПРАВКА ЗАЯВКИ НА ВСТУПЛЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    async newTeamMember(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try {
            const {id} = jwtService.decodeJWT(req.headers.authorization.split(' ')[1])
            const{comandId} = req.body;
            let result = await teamService.newMember(id,comandId)
            return res.json({result})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // ОТМЕНА ЗАЯВКИ НА ВСТУПЛНЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    async declineQueue(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {id} = jwtService.decodeJWT(req.headers.authorization.split(' ')[1])
            let queue = await teamService.declineQueue(id)
            return res.json({message:`Пользователь ${id} удален с очереди`, queue})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // Переход в другую каманду
    async changeComand(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {id} = jwtService.decodeJWT(req.headers.authorization.split(' ')[1])
            const{comandId} = req.body
           
            let queue = await teamService.changeComand(id, comandId)
            return res.json(queue)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }


    //ИНФОРМАЦИЯ ПРО ИГРОКОВ В ОДНОЙ КОМАНДЕ
    async teamMembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            const {id} = jwtService.decodeJWT(req.headers.authorization.split(' ')[1])
            let team = await teamService.teamMembers(id)
            return res.json({team})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }

    // ВСЕ УЧАСНИКИ С ДВУХ КОМАНД
    async allMembers(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            let teams = await teamService.allMembers()
            return res.json({teams})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }
    }
    // -------- TEAM --------
}

module.exports = new TeamController()
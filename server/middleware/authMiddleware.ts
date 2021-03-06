import * as express from 'express';
const jwt = require('jsonwebtoken')

export default function( req:express.Request, res:express.Response, next:express.NextFunction){
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token)
        {
            return res.status(401).json({message:"Пользователь не авторизован"})
        }
        const user =jwt.verify(token, process.env.SECRET_KEY)
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({message:"Пользователь не авторизован"})
    }
}
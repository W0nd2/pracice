import {Request, Response, NextFunction} from 'express'

export default function (req: Request, res: Response, next: NextFunction)  {
    try {
        if(req.method === 'OPTIONS')
            return next();
        if(req.user)
            return next();
        return res.status(401).json({message: 'Not authorized'});
    } catch (error) {
        return res.status(401).json({message: 'Not authorized'});
    }
}
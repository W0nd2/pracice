const ApiError = require('../error/ApiError')
import * as express from 'express';

module.exports = function(err: ApiError, req:express.Request, res:express.Response, next:express.NextFunction)
{
    if(err instanceof ApiError)
    {
        return res.status(err.status).json({message:err.message});
    }
    return res.status(500).json({message:"Непредвиденная ошибка!"})
}
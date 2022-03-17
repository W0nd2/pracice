import * as express from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../error/ApiError';
import authService from '../services/authService';
import jwtService from '../services/jwtService';
import roleService from '../services/roleService';
import User from '../models/userModel';

class AuthController{
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
            let user = await authService.registration(email, password, login, role)
            return res.json(user);
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
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
            let user = await authService.login(email, password)
            console.log(user)
            if(user instanceof ApiError)
            {
                return res.json(user)
            }
            user = user as User
            let role = await roleService.findRole(user.roleId)
            // проверить
            let token = jwtService.genereteJwt(user.id, user.email, user.login, String(role))
            return res.json({token});
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }

    }

    async checkJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id, email, login, role } = req.body
            const token = jwtService.genereteJwt(id, email, login, role);
            return res.json({ token })
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }

    }

    //     Start  -------    Google auth     -------  Start
    async successGoogleAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            
            const { email, name } = req.user;
            console.log('--------------------------------')
            console.log(name)
            let user = await authService.googleAuth(email, name.givenName)
            // проверить
            if(user instanceof ApiError){
                return res.json(user)
            }
            let role = await roleService.findRole(user.roleId)
            const token = jwtService.genereteJwt(user.id, user.email, user.login, String(role))
            return res.json({ token })
        } catch (error) {
            console.log(error);
            return ApiError.internal('Error google auth');
        }
    }

    async failureGoogleAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        return ApiError.internal("Failure login")
    }

    async loginGoogle(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { email } = req.body;
            let user = await authService.loginGoogle(email);
            if( user instanceof ApiError){
                return res.json({user})
            }
            let role = await roleService.findRole(user.roleId)
            // проверить
            const token = jwtService.genereteJwt(user.id, user.email, user.login, String(role))
            return res.json({token});
        } catch (error) {
            console.log(error)
            return ApiError.internal(error);
        }
    }

    async logoutGoogle(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.session.destroy(() => { });
        return res.json({ message: 'Logged out Google Account' })
    }

    //     END  -------    Google auth     -------  END
}

export default new AuthController()
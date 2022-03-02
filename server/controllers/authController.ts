import * as express from 'express';
import { validationResult } from 'express-validator';
const ApiError = require('../error/ApiError');
//const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const authService = require('../services/authService')
const jwtService = require('../services/jwtService')
const roleService = require('../services/roleService')

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
            let user = await authService.login(email, password)
            console.log(user)
            if(user instanceof ApiError)
            {
                return res.json(user)
            }
            let role = await roleService.findRole(user.roleId)
            
            let token = jwtService.genereteJwt(user.id, user.email, user.login, role)
            return res.json({token});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error' });
        }

    }

    async checkJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id, email, login, role } = req.body
            const token = jwtService.genereteJwt(id, email, login, role);
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
            let user = await authService.googleAuth(email, name.givenName)
            const token = jwtService.genereteJwt(user.id, user.email, user.login, user.role)
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
            let user = await authService.loginGoogle(email);
            let role = await roleService.findRole(user.roleId)
            const token = jwtService.genereteJwt(user.id, user.email, user.login, role)
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
}

module.exports = new AuthController()
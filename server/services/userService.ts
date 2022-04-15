import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError';
import User from '../models/userModel'
import mailService from '../services/mailService'
import jwtService from  '../services/jwtService'

class UserService {
    // -------- USER --------

    // PROFILE
    async checkProfile(id: number):Promise<User | ApiError>{
        const user = await User.findOne({where: {id},attributes: { exclude: ['password']}})
        if(!user)
        {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        return user
    }

    // LOGIN
    async changeLogin(id: number, newLogin: string):Promise<User | ApiError> {
        const user = await User.findOne({ where: { id },attributes: { exclude: ['password']}})
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        user.login = newLogin;
        await user.save();
        return user;
    }

    // AVATAR
    async changeAvatar(id: number, fileName: string):Promise<User | ApiError> {
        const user = await User.findOne({ where: { id },attributes: { exclude: ['password']}})
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        user.avatar=fileName;
        await user.save();
        return user;
    }

    // PASSWORD

    async forgotPassword(newPassword: string, token: string):Promise<string | ApiError>{
        let userToken = jwtService.decodeJWT(token)
        let message = 'Пользователь сменил пароль';
        let id:number 
        if(typeof userToken == 'object'){
            id= userToken.id
        }
        let user = await User.findOne({ where: { id }})
        if (!user) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        const hashPassword = await bcrypt.hash(newPassword, 5);
        user.password = hashPassword;
        user.save();
        return message;
    }

    async changePassword(email: string):Promise<string | ApiError> {
        let message = 'Письмо отправлено не почту';
        const user = await User.findOne({where:{email}})
        if(!user){
            return ApiError.internal('Пользователя с таким email не существует')
        }
        const token = jwtService.genereteJwt(user.id,user.email,user.login,String(user.roleId));
        mailService.sendMail(user.email, `http://127.0.0.1:5500/client/password.html#token=${token}`);
        return message;
    }

    // -------- USER --------
}

export default new UserService()
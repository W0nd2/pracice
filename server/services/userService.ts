import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError';
import User from '../models/userModel'
import mailService from '../services/mailService'
import jwtService from  '../services/jwtService'

class UserService {
    // -------- USER --------

    // PROFILE
    async checkProfile(id: number):Promise<User | ApiError>{
        const user = await User.findOne({where: {id} })
        if(!user)
        {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        return user
    }

    // LOGIN
    async changeLogin(id: number, newLogin: string):Promise<User | ApiError> {
        const user = await User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        user.login = newLogin;
        await user.save();
        return user;
    }

    // AVATAR
    async changeAvatar(id: number, fileName: string):Promise<User | ApiError> {
        const user = await User.findOne({ where: { id } })
        if (!user) {
            return ApiError.internal('Пользователя с таким id не существует')
        }
        user.avatar=fileName;
        await user.save();
        return user;
    }

    // PASSWORD
    async forgotPassword(id: number, newPassword: string):Promise<User | ApiError>{
        //console.log(newPassword)
        let user = await User.findOne({ where: { id }})
        if (!user) {
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        const hashPassword = await bcrypt.hash(newPassword, 5);
        user.password = hashPassword;
        user.save();
        return user;
    }

    async changePassword(email: string):Promise<User | ApiError> {
        // отправить ссылку на почту для смены пароля
        const user = await User.findOne({where:{email}})
        if(!user){
            return ApiError.internal('Пользователя с таким ID не существует')
        }
        const token = jwtService.genereteJwt(user.id,user.email,user.login,String(user.roleId));
        //переделать немного(на почту отправляеться ссылка на бек, переделать на ссылку на фронт, когда будет готов)
        mailService.sendMail(user.email, `http://127.0.0.1:5500/client/password.html#token=${token}`);
        return user;
    }

    // -------- USER --------
}

export default new UserService()
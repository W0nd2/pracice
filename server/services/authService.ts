import * as bcrypt from 'bcrypt';
import ApiError from '../error/ApiError';
import AproveList from '../models/aprovelistModel';
import User from '../models/userModel'
import Banlist from '../models/banlistModel';

class AuthService {
    // -------- AUTH --------
    async registration(email: string, password: string, login: string, role: number):Promise<User | ApiError> {
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            return ApiError.bedRequest('Пользователь с таким email уже существует')
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ email, password: hashPassword, login, roleId: role})
        await Banlist.create({ userId: user.id })
        if (role == 2) {
            await AproveList.create({ userId: user.id })
        }
        return user;
    }

    async login(email: string, password: string):Promise<User | ApiError> {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        if(user.roleId == 2 && !user.managerActive)
        {
            return ApiError.internal('Администратор ещё не подтвержил вашу заявку')
        }
        if (user.accountType === 'Google') {
            return ApiError.internal('Пользователь зареистрированый')
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return ApiError.internal('Неверный пароль')
        }
        return user;
    }

    async googleAuth(email: string, name: string):Promise<User | ApiError> {
        let user = await User.findOne({where: { email },attributes: { exclude: ['password'] } });
        if (!user) {
            user = await User.create({ email, login: name, accountType: 'Google' })
        }
        return user;
    }

    async loginGoogle(email: string):Promise<User | ApiError> {
        const user = await User.findOne({ where: { email },attributes: { exclude: ['password'] }  })
        if (!user) {
            return ApiError.internal('Пользователя с таким email не существует')
        }
        return user;
    }

    // -------- AUTH --------
}

export default new AuthService()
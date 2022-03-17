import webtoken from 'jsonwebtoken'

class WebToken {
    genereteJwt(id: number, email: string, login: string, role: string) {
        return webtoken.sign(
            { id, email, login, role },//payload
            process.env.SECRET_KEY,
            { expiresIn: '12h' }
        )
    }

    decodeJWT(token: string) {
    const decoded = webtoken.verify(token, process.env.SECRET_KEY)
    return decoded
    }
}

export default new WebToken()
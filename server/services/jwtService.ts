const webtoken = require('jsonwebtoken')


module.exports = function (id: number, email: string, login: string, role: string){
    return webtoken.sign(
        { id, email, login, role },//payload
        process.env.SECRET_KEY,
        { expiresIn: '12h' }
    )
}

// function decodeJWT(token:string){
//     const decoded = jwt.verify(token, process.env.SECRET_KEY)
//     return decoded
// }

// module.exports = {
//     generateJWT,decodeJWT
// }
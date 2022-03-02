function loginUser(){
    //мыло, пароль
    let lgEmail = document.getElementById('login-email').value
    let lgPassword = document.getElementById('login-password').value

    //ссылка на бек с логином
    const requestURL = 'http://localhost:5000/api/auth/login'

    //сделать запись токена в локал сторедж или куки
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");

        const body = {
            email: lgEmail,
            password: lgPassword
        }
        console.log(body)
        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            if (xhr.response.token != undefined) {
                localStorage.clear()
                localStorage.setItem('token', xhr.response.token)
                console.log(xhr.response)
                window.location.pathname = '/client/index.html'
            }
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })

}

//запрос на смену пароля
function resetPass(){
    //dedmoroz1472002@gmail.com
    
    let reqEmail = document.getElementById('login-email').value

    //ссылка на бек с регистрацией
    const requestURL = 'http://localhost:5000/api/user/password/change'

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");

        const body = {
            email: reqEmail
        }

        console.log(body)

        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            console.log(xhr.response)
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}


function userRegistration(){
    
    //мыло, пароль, логин
    let regEmail = document.getElementById('registration-email').value
    let regPassword = document.getElementById('registration-password').value
    let regLogin = document.getElementById('registration-login').value
    //ссылка на бек с регистрацией
    const requestURL = 'http://localhost:5000/api/auth/registration'

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");

        const body = {
            email: regEmail,
            password: regPassword,
            login: regLogin
        }

        console.log(body)

        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            localStorage.clear()
            localStorage.setItem('token', xhr.response.token)
            console.log(xhr.response)
            window.location.pathname = '/client/login.html'
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function managerRegistration(){
    //мыло, пароль, логин
    let regEmail = document.getElementById('registration-email').value
    let regPassword = document.getElementById('registration-password').value
    let regLogin = document.getElementById('registration-login').value

    //ссылка на бек с регистрацией
    const requestURL = 'http://localhost:5000/api/auth/registration'

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");

        const body = {
            email: regEmail,
            password: regPassword,
            login: regLogin,
            role: 2
        }

        console.log(body)

        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            localStorage.clear()
            localStorage.setItem('token', xhr.response.token)
            console.log(xhr.response)
            window.location.pathname = '/client/login.html'
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}
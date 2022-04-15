function userRegistration(){
    let regEmail = document.getElementById('registration-email').value
    let regPassword = document.getElementById('registration-password').value
    let regLogin = document.getElementById('registration-login').value
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
        xhr.send(JSON.stringify(body))
        xhr.onload = () => {
            localStorage.clear()
            localStorage.setItem('token', xhr.response.token)
            window.location.pathname = '/client/login.html'
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function managerRegistration(){
    let regEmail = document.getElementById('registration-email').value
    let regPassword = document.getElementById('registration-password').value
    let regLogin = document.getElementById('registration-login').value
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
        xhr.send(JSON.stringify(body))
        xhr.onload = () => {
            localStorage.clear()
            localStorage.setItem('token', xhr.response.token)
            const roomName = 'Manager registration'
            const userRole = 'MANAGER'
            const message = "Новый менеджер ожидает подтверждения регистрации"
            const socketUrl = "http://localhost:8000"
            const socket = io(socketUrl)
            socket.on("connect", () => {
                socket.emit("CREATE_OR_JOIN_ROOM", ({roomName, userRole }));
            });
            socket.on("JOINED_ROOM", (value)=>{
                alert(value)
            })
            socket.emit("SEND_ROOM_MESSAGE",{roomName, message})
            socket.on("ROOM_MESSAGE",(message)=>{
                alert(message)
            })
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}
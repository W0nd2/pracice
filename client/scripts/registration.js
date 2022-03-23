

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

            //сокеты
            const roomName = 'Manager registration'
            const userRole = 'MANAGER'
            //const roomId = 1
            const message = "Новый менеджер ожидает подтверждения регистрации"
            // "/socket.io/socket.io.js"
            //"https://cdn.socket.io/socket.io-1.4.5.js"
            const socketUrl = "http://localhost:8000"
            const socket = io(socketUrl)
            socket.on("connect", () => {
                //console.log(socket.connected); // true              
                //console.log(socket.id); // x8WIv7-mJelg7on_ALbx
                //создание комнаты
                socket.emit("CREATE_OR_JOIN_ROOM", ({roomName, userRole } /* возможно передавать с локал сторедж роль пользователя*/));
            });
        
            //все комнаты
            // socket.on("ROOMS", (value)=>{
            //     console.log(value);
            // })
            
            //вывод сообщения о том что пользователь присоеденился к группе
            socket.on("JOINED_ROOM", (value)=>{
                console.log(value)
            })
        
            //отправка сообщения на сервер
            socket.emit("SEND_ROOM_MESSAGE",{roomName, message})
        
            //не работает получение сообщения
            socket.on("ROOM_MESSAGE",(message)=>{
                
                console.log(message)
            })
            //window.location.pathname = '/client/login.html'
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}
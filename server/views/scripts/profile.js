function checkProfile(){

    //токен с локал стореджа
    let token = localStorage.getItem('token')
    console.log(token)

    //ссылка на бек с просмотром профайла пользователя
    const requestURL = 'http://localhost:5000/api/user/profile'

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', requestURL)

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        
        

        xhr.send()

        xhr.onload = () => {
            let res = JSON.parse(xhr.response)
            console.log(res)
            document.getElementById('profile-email').innerText += ` ${res.email}`
            document.getElementById('profile-login').innerText += ` ${res.login}`
            if(res.avatar){
                document.getElementById('profile-img').src=`http://localhost:5000/${res.avatar}`
            }
            
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

//запрос на изменение логина
function changeLogin(){
    let login = document.getElementById('profile-change-email').value
    let token = localStorage.getItem('token')

    console.clear()
    console.log(token)

    const requestURL = 'http://localhost:5000/api/user/login/change'
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('PATCH', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        

        const body = {
            newLogin: login
        }

        xhr.send(JSON.stringify(body))//

        xhr.onload = () => {
            console.log(xhr.response)
            //let res = JSON.parse(xhr.response)
            //console.log(res)
            document.getElementById('profile-email').innerText = 'Email: '
            document.getElementById('profile-email').innerText += ` ${xhr.response.email}`
            document.getElementById('profile-login').innerText = 'Login: '
            document.getElementById('profile-login').innerText += ` ${xhr.response.login}`
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

//запрос на изменение аватара

function changeAvatar(event) {
    let token = localStorage.getItem('token')
    const requestURL = 'http://localhost:5000/api/user/avatar/change'
    let target = event.target || event.srcElement || event.currentTarget;
    let avatar = target.files[0];
    return new Promise((resolve, reject) => {

        const FData = new FormData();

        FData.append(`avatar`,avatar);

        let xhr = new XMLHttpRequest();

        xhr.open("PATCH", requestURL);

        //xhr.setRequestHeader("Content-type", "application/octate-stream");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(FData);

        xhr.onload = () => {
            console.log(xhr.response)
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
        
    })
    event.target.value = "";
}

document.querySelector('#profile-upload').addEventListener('change', changeAvatar)

function logoutMember(){
    localStorage.clear()
    window.location.pathname = '/client/login.html'
}
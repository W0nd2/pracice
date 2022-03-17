function allMembers() {
    if (!localStorage.token) {
        window.location.pathname = '/client/login.html'
    }
    //токен с локал стореджа
    let token = localStorage.getItem('token')
    console.log(token)

    //ссылка на бек с просмотром профайла пользователя
    const requestURL = 'http://localhost:5000/api/user/allMembers'

    let element = document.getElementById("team");

    return new Promise((resolve, reject) => {

        let element = document.getElementById('comands')

        const xhr = new XMLHttpRequest()

        xhr.open('GET', requestURL)

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.send()

        xhr.onload = () => {
            let res = JSON.parse(xhr.response)
            console.log(res)
            let firstComand = document.getElementById('firstComand-members');
            let secondComand = document.getElementById('secondComand-members');
            
            for (let index = 0; index < res.teams.length; index++) {
                for (let userIndex = 0; userIndex < res.teams[index].users.length; userIndex++) {
                    let newMember = `
                    
                        <span>${res.teams[index].users[userIndex].email}</span>
                    
                    `
                    if (res.teams[index].comandName == '111') {
                        const member = document.createElement('div')
                        member.innerHTML = newMember
                        firstComand.appendChild(member)
                    }
                    else {
                        const member = document.createElement('div')
                        member.innerHTML = newMember
                        secondComand.appendChild(member)
                    }
                    
                }
                
            }


        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}


function joinTeam(teamId){
    console.log(teamId)
    const requestURL = 'http://localhost:5000/api/user/newTeamMember'

    let token = localStorage.getItem('token')

    //сделать запись токена в локал сторедж или куки
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        const body = {
            comandId: teamId
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
//осталось сделать запросы на блокировку пользователя, подтверждение регистрации админа, переход в другую команду, востановление пароля(посмотреть какие запросы остались)
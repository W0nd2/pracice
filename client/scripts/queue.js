function getQueue(){
    let element = document.getElementById("body");
    

    //токен с локал стореджа
    let token = localStorage.getItem('token')
    console.log(token)

    //ссылка на бек с просмотром профайла пользователя
    const requestURL = 'http://localhost:5000/api/admin/queue'

    

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', requestURL)

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);



        xhr.send()
        
        xhr.onload = () => {
            let data = JSON.parse(xhr.response)
            let queueData = data.queue
            
            console.log(queueData,queueData.length)
            for (let index = 0; index < queueData.length; index++) {
                const resultHTML=`
                <div class="member" id="${queueData[index].userId}">
                    <span id="member-id">userId: ${queueData[index].userId}</span>
                    <span id="member-comand">comandId: ${queueData[index].comandId}</span>
                    <button id="member-registration" onclick="confirmMember(${queueData[index].userId},${queueData[index].comandId})">Подтвердить регистрацию</button>
                    <button id="member-registration" onclick="declineMember(${queueData[index].userId})">Отменить регистрацию</button>
                </div>
                `;
                const newDiv =document.createElement("div");
                newDiv.innerHTML = resultHTML;
                element.appendChild(newDiv);
            }
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function confirmMember(user,comand){
    
    // сделать, мб хронить массив данных
    console.log(user,comand)

    const requestURL = 'http://localhost:5000/api/admin/confirmMember'

    let token = localStorage.getItem('token')

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        const body = {
            userId: user,
            comandId: comand
        }

        console.log(body)

        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            console.log(xhr.response)
            document.getElementById('body').innerHTML=''
            getQueue()
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function declineMember(user) {
    // сделать, мб хронить массив данных
    console.log(user)

    const requestURL = 'http://localhost:5000/api/admin/declineByManager'

    let token = localStorage.getItem('token')

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('DELETE', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        const body = {
            userId: user
        }

        console.log(body)

        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            console.log(xhr.response)
            document.getElementById('body').innerHTML = ''
            getQueue()
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}
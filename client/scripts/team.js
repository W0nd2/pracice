function teamMembers() {
    // http://localhost:5000/api/user/teamMembers
    //токен с локал стореджа
    let token = localStorage.getItem('token')
    console.log(token)

    //ссылка на бек с просмотром профайла пользователя
    const requestURL = 'http://localhost:5000/api/user/teamMembers'

    let element = document.getElementById("team");

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', requestURL)

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);



        xhr.send()

        xhr.onload = () => {
            let res = JSON.parse(xhr.response)
            console.log(res)
            if (res.length == 0) {
                const resultHTML = `
                <div class="member" >
                    <span id="member-id">Вы не состоите в команде</span>
                </div>
                `;
                const newDiv = document.createElement("div");
                newDiv.innerHTML = resultHTML;
                element.appendChild(newDiv);
            }
            else {
                for (let index = 0; index < res.team.length; index++) {
                    const resultHTML = `
                <div class="member" >
                    <span id="member-id">userId: ${res.team[index].userId}</span>
                </div>
                `;
                    const newDiv = document.createElement("div");
                    newDiv.innerHTML = resultHTML;
                    element.appendChild(newDiv);
                }
            }

        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}
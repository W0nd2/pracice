const webSocket = require('ws');

const webSocketServer = new webSocket.Server({
    port:process.env.WS_PORT || 6000
},()=> console.log(`Server started on port: 6000`))

webSocketServer.on('connection', function connection(ws:any){

    ws.on('message', function(message:any){
        message = JSON.parse(message);
        switch(message.event){
            case 'message':
                //broadcastMessage(message)
                break;
            case 'connection':
                //broadcastMessage(message)
                break;
        }
    })
})

// function broadcastMessage(message:any){
//     webSocketServer.clients.forEach(client => {
//         // возможно сделать ключ и в токен пользователя запихнуть ключ чтобы проверять и отправлять админу или модератору письмо
//         client.send(JSON.stringify(message))
//     });
// }
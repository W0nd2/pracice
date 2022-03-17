require('dotenv').config();
import express  from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const PORT = Number(process.env.SOCKET_PORT) || 8000;
const HOST = "localhost"
//const corsOrigin = 'http://localhost:8000'


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:{
        credentials:true
    }
});

//app.get('/', (_,res) => res.send("sever is up"))
const EVENTS ={
    connection:'connetion',
    CLIENT:{
        MANAGER_ROOM:"MANAGER_ROOM",
    }
}

let rooms:string[] =[]

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`)
        /*
                                Регистрация нового менеджера
                                   (предполодительно так) 
            создать новую комнату, если будет уже создана комната то не создавать
            узнать как можно туда отправить админа
        */
    socket.on(EVENTS.CLIENT.MANAGER_ROOM,(roomName)=>{
        console.log({roomName})
        if(!rooms.includes(roomName))
        {
            rooms.push(roomName)
        }
        console.log(rooms)
    })
});

httpServer.listen(PORT,()=>{
    console.log('Server is listening');
});
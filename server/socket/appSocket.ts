require('dotenv').config();
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const PORT = Number(process.env.SOCKET_PORT) || 8000;
const HOST = "localhost"
//const corsOrigin = 'http://localhost:8000'


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        credentials: true
    }
});

//app.get('/', (_,res) => res.send("sever is up"))
const EVENTS = {
    connection: 'connetion',
    CLIENT: {
        CREATE_OR_JOIN_ROOM: "CREATE_OR_JOIN_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE"
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE"
    }
}

let rooms: string[] = []

let users: object[] = []

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`)
    socket.on(EVENTS.CLIENT.CREATE_OR_JOIN_ROOM, ({ roomName, userRole }) => {
        //console.log(roomName, userRole);
        if (!rooms.includes(roomName)) {
            rooms.push(roomName);
        }
        users.push({
            id: socket.id,
            role: userRole
        });
        console.log('--------------------------');
        console.log('Активные комнаты');
        console.log(rooms);
        console.log('Пользователи и их роли');
        console.log(users);
        console.log('--------------------------');
        //привязка к комнате
        socket.join(roomName);
        //может и не надо делать оповещение о новой комнате
        //socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms)
        //socket.emit(EVENTS.SERVER.ROOMS, rooms)

        // пользователь зашел в комнату
        socket.broadcast.to(roomName).emit(EVENTS.SERVER.JOINED_ROOM, `Пользователь ${socket.id} присоеденился к группе ${roomName}`)
    })

    /* Отправка сообщения пользователя в комнату */
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomName, message }) => {
        console.log(roomName, message)
        socket.to(roomName).emit(EVENTS.SERVER.ROOM_MESSAGE, message)
    })
});

httpServer.listen(PORT, () => {
    console.log('Server is listening');
});
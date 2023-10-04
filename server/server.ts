import { Room, RoomID, User } from "@app/common";
import { Server } from "socket.io";

const io = new Server(8080, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:5173"],
    }
});


const rooms = new Map<RoomID, Room>();

io.on('connect', socket => {
    console.log(socket.id);

    socket.on('message', (message, username) => {
        console.log(`${socket.id}: ${message}`);

        const user: User = {
            name: username,
            id: socket.id,
        }

        socket.rooms.forEach((room) => {
            socket.to(room).emit('message', message, user);
        })
    });

    socket.on('join-room', (roomId: string, username: string) => {
        console.log(`${username} ${socket.id} joined room ${roomId}`);

        socket.join(roomId);
    })

    // ping helper
    socket.on("ping", (callback) => {
        callback();
    });
})

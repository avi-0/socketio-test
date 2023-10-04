import { RoomID, State, User, UserID, initialState } from "@app/common";
import { Patch, applyPatches, enablePatches, produceWithPatches } from "immer";
import { Server } from "socket.io";

enablePatches();

const io = new Server(8080, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:5173"],
    }
});

type Room = {
    patches: Patch[],
 }

 function newRoom() {
    return {
        patches: [],
    }
 }

 function compressPatches(state: State, patches: Patch[]) {
    const [_newState, newPatches, _inversePatches] = produceWithPatches(state, draft => {
        applyPatches(draft, patches);
    });

    return newPatches;
 }

const userRooms = new Map<UserID, RoomID>();
const rooms = new Map<RoomID, Room>();

io.on('connect', socket => {
    socket.on('message', (message, username) => {
        console.log(`${username}: ${message}`);

        const user: User = {
            name: username,
            id: socket.id,
        }

        socket.rooms.forEach((room) => {
            socket.to(room).emit('message', message, user);
        })
    });

    socket.on('join-room', (roomID: string, username: string) => {
        console.log(`${username} joined room ${roomID}`);

        const currentRoomID = userRooms.get(socket.id);
        if (currentRoomID) {
            socket.leave(currentRoomID);
            userRooms.delete(socket.id);
        }

        socket.join(roomID);
        userRooms.set(socket.id, roomID);

        const room = rooms.get(roomID);
        if (!room) {
            rooms.set(roomID, newRoom());
        } else {
            socket.emit('state-patches', room.patches);
        }
    })

    socket.on('state-patches', patches => {
        // console.log(patches);

        const roomID = userRooms.get(socket.id);
        if (roomID) {
            socket.to(roomID).emit('state-patches', patches);

            const room = rooms.get(roomID);
            if (room) {
                room.patches.push(...patches);

                room.patches = compressPatches(initialState, room.patches);
                console.log(room.patches);
            }
        }
    }) 

    // ping helper
    socket.on("ping", (callback) => {
        callback();
    });
})

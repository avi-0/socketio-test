import { RoomID, State, User, UserID, initialState } from "../common/types";
import { Patch, applyPatches, enablePatches, produceWithPatches } from "immer";
import { Socket, Server as SocketIOServer } from "socket.io";

enablePatches();

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

class Server {
    io: SocketIOServer;
    userRooms = new Map<UserID, RoomID>();
    rooms = new Map<RoomID, Room>();

    constructor() {
        this.io = new SocketIOServer(8080, {
            cors: {
                origin: ["http://localhost:8080", "http://localhost:5173"],
            }
        });

        this.io.on('connect', socket => {
            socket.on('message', this.onMessage(socket));
            socket.on('join-room', this.onJoinRoom(socket));
            socket.on('state-patches', this.onStatePatches(socket));
            socket.on("ping", this.onPing(socket));
        })

        console.log("server started");
    }

    onMessage = (socket: Socket) => (message: string, username: string) => {
        const user: User = {
            name: username,
            id: socket.id,
        }

        socket.rooms.forEach((room) => {
            socket.to(room).emit('message', message, user);
        })

        console.log(`${username}: ${message}`);
    }

    onJoinRoom = (socket: Socket) => (roomID: string, username: string) => {
        const currentRoomID = this.userRooms.get(socket.id);
        if (currentRoomID) {
            socket.leave(currentRoomID);
            this.userRooms.delete(socket.id);
        }

        socket.join(roomID);
        this.userRooms.set(socket.id, roomID);

        const room = this.rooms.get(roomID);
        if (!room) {
            this.rooms.set(roomID, newRoom());
        } else {
            socket.emit('state-patches', room.patches);
        }

        console.log(`${username} joined room ${roomID}`);
    }

    onStatePatches = (socket: Socket) => (patches: Patch[]) => {
        const roomID = this.userRooms.get(socket.id);
        if (roomID) {
            socket.to(roomID).emit('state-patches', patches);

            const room = this.rooms.get(roomID);
            if (room) {
                room.patches.push(...patches);

                room.patches = compressPatches(initialState, room.patches);
                console.log(room.patches);
            }
        }
    }

    onPing = (_socket: Socket) => (callback: () => void) => {
        callback();
    }
}

new Server();
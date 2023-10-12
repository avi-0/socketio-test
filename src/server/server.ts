import { RoomID, State, User, UserID, initialState } from "../common/types";
import { Patch, applyPatches, enablePatches, produceWithPatches } from "immer";
import { Socket, Server as SocketIOServer } from "socket.io";

enablePatches();

function compressPatches(state: State, patches: Patch[]) {
    const [_newState, newPatches, _inversePatches] = produceWithPatches(state, draft => {
        applyPatches(draft, patches);
    });

    return newPatches;
}

class Room {
    id: RoomID;
    patches: Patch[] = [];
    users: Map<UserID, User> = new Map();

    constructor(id: RoomID) {
        this.id = id;
    }

    join(socket: Socket, username: string) {
        const user = {
            id: socket.id,
            name: username,
        }

        socket.emit('state-patches', this.patches);

        socket.join(this.id);
        this.users.set(user.id, user);

        socket.on('message', this.onMessage(socket, user));
        socket.on('state-patches', this.onStatePatches(socket));

        socket.on('disconnect', () => {
            this.users.delete(user.id);
        })

        console.log(`${username} joined room ${this.id}`);
    }

    onMessage = (socket: Socket, user: User) => (message: string, _: string) => {
        socket.to(this.id).emit('message', message, user.name);

        console.log(`${user.name}: ${message}`);
    }

    onStatePatches = (socket: Socket) => (patches: Patch[]) => {
        socket.to(this.id).emit('state-patches', patches);

        this.patches.push(...patches);
        this.patches = compressPatches(initialState, this.patches);

        console.log(this.patches);
    }
}

class Server {
    io: SocketIOServer;
    rooms = new Map<RoomID, Room>();

    constructor() {
        this.io = new SocketIOServer(8080, {
            cors: {
                origin: ["http://localhost:8080", "http://localhost:5173"],
            }
        });

        this.io.on('connect', socket => {
            socket.on('join-room', this.onJoinRoom(socket));
            socket.on('ping', this.onPing(socket));
        })

        console.log("server started");
    }

    getRoom(roomID: RoomID): Room {
        if (!this.rooms.has(roomID)) {
            const room = new Room(roomID);
            this.rooms.set(roomID, room);

            return room;
        }

        return this.rooms.get(roomID)!;
    }

    onJoinRoom = (socket: Socket) => (roomID: RoomID, username: string) => {
        this.getRoom(roomID).join(socket, username);
    }

    onPing = (_socket: Socket) => (callback: () => void) => {
        callback();
    }
}

new Server();
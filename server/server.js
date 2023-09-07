const io = require('socket.io')(8080, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:5173"],
    }
});

io.on('connect', socket => {
    console.log(socket.id);

    socket.on('message', (message, username) => {
        console.log(`${socket.id}: ${message}`);

        const user = {
            name: username,
            id: socket.id,
        }

        socket.rooms.forEach((room) => {
            socket.to(room).emit('message', message, user);
        })
    });

    socket.on('join-room', (roomId) => {
        console.log(`${socket.id} joined room ${roomId}`);

        socket.join(roomId);
    })

    // ping helper
    socket.on("ping", (callback) => {
        callback();
    });
})

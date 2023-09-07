const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:5173"],
    }
});

io.on('connect', socket => {
    console.log(socket.id);

    socket.on('message', (message) => {
        console.log(`${socket.id}: ${message}`);

        socket.broadcast.emit('message', message);
    });
})

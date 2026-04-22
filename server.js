const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let rooms = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Helper to send names of active rooms to everyone
function broadcastRoomList() {
  io.emit('room-list', Object.keys(rooms));
}

io.on('connection', (socket) => {
  // Send current list immediately upon connecting
  socket.emit('room-list', Object.keys(rooms));

  socket.on('join-room', (data) => {
    const { roomName, password, username, isCreating } = data;

    // Handle room creation logic
    if (isCreating) {
      if (rooms[roomName]) return socket.emit('error-msg', 'Room already exists.');
      rooms[roomName] = { password, messages: [], users: new Set() };
      broadcastRoomList(); 
    }

    if (!rooms[roomName]) return socket.emit('error-msg', 'Room does not exist.');
    if (rooms[roomName].password !== password) return socket.emit('error-msg', 'Incorrect password.');

    socket.join(roomName);
    socket.currentRoom = roomName;
    socket.username = username;
    rooms[roomName].users.add(socket.id);

    socket.emit('load history', rooms[roomName].messages);
  });

  socket.on('chat message', (data) => {
    if (socket.currentRoom && rooms[socket.currentRoom]) {
      const msg = { username: socket.username, text: data.text };
      rooms[socket.currentRoom].messages.push(msg);
      if (rooms[socket.currentRoom].messages.length > 100) rooms[socket.currentRoom].messages.shift();
      io.to(socket.currentRoom).emit('chat message', msg);
    }
  });

  socket.on('disconnect', () => {
    const roomName = socket.currentRoom;
    if (roomName && rooms[roomName]) {
      rooms[roomName].users.delete(socket.id);
      if (rooms[roomName].users.size === 0) {
        delete rooms[roomName];
        broadcastRoomList();
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server on ${PORT}`));
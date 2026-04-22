const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allow external websites to connect
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Store rooms in memory
let rooms = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Helper to send names of active rooms to everyone in the lobby
function broadcastRoomList() {
  io.emit('room-list', Object.keys(rooms));
}

io.on('connection', (socket) => {
  // 1. Send current list immediately upon connecting
  socket.emit('room-list', Object.keys(rooms));

  // 2. Handle Joining or Creating a room
  socket.on('join-room', (data) => {
    const { roomName, password, username, isCreating } = data;

    if (isCreating) {
      if (rooms[roomName]) return socket.emit('error-msg', 'Room already exists.');
      rooms[roomName] = { password, messages: [], users: new Set() };
      broadcastRoomList(); 
    }

    if (!rooms[roomName]) return socket.emit('error-msg', 'Room does not exist.');
    if (rooms[roomName].password !== password) return socket.emit('error-msg', 'Incorrect password.');

    // Join the specific room
    socket.join(roomName);
    socket.currentRoom = roomName;
    socket.username = username;
    rooms[roomName].users.add(socket.id);

    // Send the last 100 messages
    socket.emit('load history', rooms[roomName].messages);
  });

  // 3. Handle incoming chat messages
  socket.on('chat message', (data) => {
    if (socket.currentRoom && rooms[socket.currentRoom]) {
      const msg = { username: socket.username, text: data.text };
      
      rooms[socket.currentRoom].messages.push(msg);
      if (rooms[socket.currentRoom].messages.length > 100) rooms[socket.currentRoom].messages.shift();
      
      io.to(socket.currentRoom).emit('chat message', msg);
    }
  });

  // 4. Handle a user explicitly clicking the "Leave" button
  socket.on('leave-room', () => {
    const roomName = socket.currentRoom;
    if (roomName && rooms[roomName]) {
      rooms[roomName].users.delete(socket.id);
      socket.leave(roomName); 
      
      // Delete room if empty
      if (rooms[roomName].users.size === 0) {
        delete rooms[roomName];
        broadcastRoomList();
      }
      
      socket.currentRoom = null;
    }
  });

  // 5. Handle a user closing their browser tab entirely
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

// Port configuration for Koyeb
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
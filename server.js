const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allow external websites to connect to this WebSocket server
const io = new Server(server, {
  cors: {
    origin: "*", // Allows any URL to connect
    methods: ["GET", "POST"]
  }
});

// Store rooms in memory
// Structure: { "roomName": { password: "...", messages: [], users: Set() } }
let rooms = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUsername = null;

  socket.on('join-room', (data) => {
    const { roomName, password, username } = data;

    // 1. Create room if it doesn't exist
    if (!rooms[roomName]) {
      rooms[roomName] = {
        password: password,
        messages: [],
        users: new Set()
      };
    }

    // 2. Validate Password
    if (rooms[roomName].password !== password) {
      return socket.emit('error-msg', 'Incorrect room password.');
    }

    // 3. Join the room
    currentRoom = roomName;
    currentUsername = username;
    socket.join(roomName);
    rooms[roomName].users.add(socket.id);

    // 4. Send room history
    socket.emit('load history', rooms[roomName].messages);
    
    console.log(`User ${username} joined room: ${roomName}`);
  });

  socket.on('chat message', (data) => {
    if (currentRoom && rooms[currentRoom]) {
      const msgData = { username: currentUsername, text: data.text };
      
      // Store in history (last 100)
      rooms[currentRoom].messages.push(msgData);
      if (rooms[currentRoom].messages.length > 100) rooms[currentRoom].messages.shift();

      // Broadcast only to people in this specific room
      io.to(currentRoom).emit('chat message', msgData);
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].users.delete(socket.id);
      
      // Delete room if empty
      if (rooms[currentRoom].users.size === 0) {
        console.log(`Room ${currentRoom} is empty. Deleting...`);
        delete rooms[currentRoom];
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Engine running on port ${PORT}`);
});
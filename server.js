const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let rooms = {};

// Simple filter list - you can add more words here
const BANNED_WORDS = ['Nigga', 'nigga', 'nigger', 'Nigger', 'Fuck', 'fuck', 'porn', 'Porn', 'cunt', 'Cunt', 'faggot', 'fag', 'Faggot', 'Fag', 'wigger', 'goon', 'Gooning', 'Goon', 'gooning', 'cum', 'Cum', 'Cock', 'Fu(k', 'Wigger', 'sex', 'Gooner', 'gooner', 'sexist'];

function filterText(text) {
  let filtered = text;
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function broadcastRoomList() {
  io.emit('room-list', Object.keys(rooms));
}

io.on('connection', (socket) => {
  // Track spam prevention per socket
  socket.lastMessageTime = 0;

  socket.emit('room-list', Object.keys(rooms));

  socket.on('join-room', (data) => {
    const { roomName, password, username, isCreating } = data;
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
    const now = Date.now();
    
    // 2-Second Spam Prevention
    if (now - socket.lastMessageTime < 2000) {
      return socket.emit('error-msg', 'Slow down! 1 message every 2 seconds.');
    }

    if (socket.currentRoom && rooms[socket.currentRoom]) {
      socket.lastMessageTime = now;
      
      // Profanity Filter
      const cleanText = filterText(data.text);
      const msg = { username: socket.username, text: cleanText };
      
      rooms[socket.currentRoom].messages.push(msg);
      if (rooms[socket.currentRoom].messages.length > 100) rooms[socket.currentRoom].messages.shift();
      
      io.to(socket.currentRoom).emit('chat message', msg);
    }
  });

  socket.on('leave-room', () => {
    const roomName = socket.currentRoom;
    if (roomName && rooms[roomName]) {
      rooms[roomName].users.delete(socket.id);
      socket.leave(roomName); 
      if (rooms[roomName].users.size === 0) {
        delete rooms[roomName];
        broadcastRoomList();
      }
      socket.currentRoom = null;
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

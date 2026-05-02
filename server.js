const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// rooms[name] = { password, messages[], users: Set, voiceUsers: Map(socketId -> username) }
let rooms = {};

const BANNED_WORDS = ['Nigga','nigga','nigger','Nigger','Fuck','fuck','porn','Porn','cunt','Cunt','faggot','fag','Faggot','Fag','wigger','goon','Gooning','Goon','gooning','cum','Cum','Cock','Fuk','Wigger','sex','Gooner','gooner','sexist'];

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

function broadcastVoiceList(roomName) {
  if (!rooms[roomName]) return;
  const voiceUsers = rooms[roomName].voiceUsers
    ? Array.from(rooms[roomName].voiceUsers.entries()).map(([id, username]) => ({ socketId: id, username }))
    : [];
  io.to(roomName).emit('voice-list', voiceUsers);
}

function handleVoiceLeave(socket) {
  const roomName = socket.currentRoom;
  if (roomName && rooms[roomName] && rooms[roomName].voiceUsers) {
    rooms[roomName].voiceUsers.delete(socket.id);
    io.to(roomName).emit('voice-user-left', { socketId: socket.id });
    broadcastVoiceList(roomName);
  }
}

io.on('connection', (socket) => {
  socket.lastMessageTime = 0;
  socket.emit('room-list', Object.keys(rooms));

  // ── Room Management ──────────────────────────────────────────────────────────

  socket.on('join-room', (data) => {
    const { roomName, password, username, isCreating } = data;

    if (isCreating) {
      if (rooms[roomName]) return socket.emit('error-msg', 'Room already exists.');
      rooms[roomName] = { password, messages: [], users: new Set(), voiceUsers: new Map() };
      broadcastRoomList();
    }
    if (!rooms[roomName]) return socket.emit('error-msg', 'Room does not exist.');
    if (rooms[roomName].password !== password) return socket.emit('error-msg', 'Incorrect password.');

    socket.join(roomName);
    socket.currentRoom = roomName;
    socket.username = username;
    rooms[roomName].users.add(socket.id);
    socket.emit('load history', rooms[roomName].messages);
    // Send current voice list so new joiner sees who's in VC
    socket.emit('voice-list', Array.from(rooms[roomName].voiceUsers.entries()).map(([id, u]) => ({ socketId: id, username: u })));
  });

  socket.on('leave-room', () => {
    handleVoiceLeave(socket);
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
    handleVoiceLeave(socket);
    const roomName = socket.currentRoom;
    if (roomName && rooms[roomName]) {
      rooms[roomName].users.delete(socket.id);
      if (rooms[roomName].users.size === 0) {
        delete rooms[roomName];
        broadcastRoomList();
      }
    }
  });

  // ── Chat ─────────────────────────────────────────────────────────────────────

  socket.on('chat message', (data) => {
    const now = Date.now();
    if (now - socket.lastMessageTime < 2000) {
      return socket.emit('error-msg', 'Slow down! 1 message every 2 seconds.');
    }
    if (socket.currentRoom && rooms[socket.currentRoom]) {
      socket.lastMessageTime = now;
      const cleanText = filterText(data.text);
      const msg = { username: socket.username, text: cleanText };
      rooms[socket.currentRoom].messages.push(msg);
      if (rooms[socket.currentRoom].messages.length > 100) rooms[socket.currentRoom].messages.shift();
      io.to(socket.currentRoom).emit('chat message', msg);
    }
  });

  // ── Voice / WebRTC Signaling ──────────────────────────────────────────────────

  socket.on('voice-join', () => {
    const roomName = socket.currentRoom;
    if (!roomName || !rooms[roomName]) return;

    const room = rooms[roomName];
    if (!room.voiceUsers) room.voiceUsers = new Map();

    // List of peers already in voice (excluding self)
    const existingPeers = Array.from(room.voiceUsers.entries())
      .map(([socketId, username]) => ({ socketId, username }));

    // Register self
    room.voiceUsers.set(socket.id, socket.username);

    // Tell the new user who to send offers to
    socket.emit('voice-users', existingPeers);

    // Tell everyone already in voice that a new peer has arrived (so they wait for offer)
    existingPeers.forEach(({ socketId }) => {
      io.to(socketId).emit('voice-user-joined', { socketId: socket.id, username: socket.username });
    });

    broadcastVoiceList(roomName);
  });

  socket.on('voice-leave', () => {
    handleVoiceLeave(socket);
  });

  // Relay WebRTC signals (offer / answer / ICE candidate) between specific peers
  socket.on('webrtc-signal', ({ to, signal }) => {
    if (!to || !signal) return;
    io.to(to).emit('webrtc-signal', {
      from: socket.id,
      username: socket.username,
      signal
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

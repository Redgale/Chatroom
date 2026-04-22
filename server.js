const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const SECRET_PASSWORD = "therealdeer";
// This array will hold our last 100 messages
let messageHistory = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  // When a user first joins, they send their password to 'validate'
  socket.on('join', (data) => {
    if (data.password === SECRET_PASSWORD) {
      // Send the stored history ONLY to this specific user
      socket.emit('load history', messageHistory);
    }
  });

  socket.on('chat message', (data) => {
    if (data.password === SECRET_PASSWORD) {
      const newMessage = { username: data.username, text: data.text };
      
      // Add to history
      messageHistory.push(newMessage);

      // If we have more than 100, remove the oldest one
      if (messageHistory.length > 100) {
        messageHistory.shift();
      }

      // Broadcast to everyone
      io.emit('chat message', newMessage);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
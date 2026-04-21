const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Your specific password
const SECRET_PASSWORD = "therealdeer";

io.on('connection', (socket) => {
  socket.on('chat message', (data) => {
     // Only broadcast if the password sent from the frontend matches
     if (data.password === SECRET_PASSWORD) {
        io.emit('chat message', { username: data.username, text: data.text });
     }
  });
});

// Port configuration for Koyeb
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
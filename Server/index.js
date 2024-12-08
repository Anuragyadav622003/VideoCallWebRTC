import express from 'express';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import http from 'http';

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

const httpServer = http.createServer(app); // Create an HTTP server using the Express app

const io = new Server(httpServer, { // Pass the HTTP server to the Socket.IO instance
  cors: {
    origin: '*', // Allow all origins; modify as needed for production
    methods: ['GET', 'POST'],
  },
});

// Rooms tracking
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle joining a room
  socket.on('join-room', (data) => {
    const { roomId, emailId } = data;

    console.log(`${emailId} joined room ${roomId}`);

    // Map email to socket ID
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);

    // Join the specified room
    socket.join(roomId);

    // Track participants in the room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);

    // Notify the user they joined the room
    socket.emit('joined-room', { roomId });

    // Notify others in the room about the new user
    socket.broadcast.to(roomId).emit('user-joined', { emailId });
  });

  // Handle initiating a call
  socket.on('call-user', (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);

    if (socketId) {
      io.to(socketId).emit('incoming-call', { from: fromEmail, offer });
    } else {
      console.log(`User with email ${emailId} not found.`);
    }
  });

  // Handle accepting a call
  socket.on('call-accepted', (data) => {
    const { to, answer } = data;
    const socketId = emailToSocketMapping.get(to);

    if (socketId) {
      io.to(socketId).emit('call-accepted', { answer });
    }
  });

  // Handle ending a call
  socket.on('end-call', (data) => {
    const { roomId } = data;

    console.log(`Call ended in room: ${roomId}`);
    io.to(roomId).emit('end-call');

    // Optionally clean up room data if needed
    if (rooms.has(roomId)) {
      rooms.get(roomId).clear();
    }
  });

  // Handle disconnecting from a room
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);

    const email = socketToEmailMapping.get(socket.id);

    // Remove user from mapping and rooms
    emailToSocketMapping.delete(email);
    socketToEmailMapping.delete(socket.id);

    for (const [roomId, participants] of rooms.entries()) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);

        // Notify others in the room
        const remainingEmail = Array.from(emailToSocketMapping.keys())
          .find(key => emailToSocketMapping.get(key) === socket.id);
        io.to(roomId).emit('user-left', { emailId: remainingEmail });

        // Remove room if empty
        if (participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });
});

// Define your Express routes
app.get('/', (req, res) => {
  res.send('Express server running with Socket.IO');
});

// Start the server on port 8000
httpServer.listen(8000, () => {
  console.log('Server running on port 8000');
});

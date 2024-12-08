import React, { useState } from 'react';
import { useSocket } from './provider/Socket';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const [email, setEmail] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const socket = useSocket();
  const navigate = useNavigate();

  const handleEnterRoom = () => {
    if (email && roomCode) {
      socket.emit('join-room', { emailId: email, roomId: roomCode });
      navigate(`/room/${roomCode}`);
    } else {
      console.log('Email and Room Code are required');
    }
  };

  return (
    <div>
      <h2>Join Room</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button onClick={handleEnterRoom}>Enter Room</button>
    </div>
  );
}

export default Homepage;

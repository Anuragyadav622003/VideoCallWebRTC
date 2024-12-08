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
    <div style={styles.container}>
      <h2 style={styles.header}>Join Room</h2>
      <div style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleEnterRoom} style={styles.button}>
          Enter Room
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  },
};

export default Homepage;

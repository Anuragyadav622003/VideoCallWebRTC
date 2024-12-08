import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useSocket } from './provider/Socket';
import { usePeer } from './provider/Peer';

function Room() {
  const socket = useSocket();
  const { peer, createOffer } = usePeer();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);

  // Start local stream
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    } catch (error) {
      console.error('Error accessing user media:', error);
    }
  };

  // End the call
  const endCall = useCallback(() => {
    console.log('Ending call...');

    // Stop local media tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Close the peer connection
    if (peer) {
      peer.close();
    }

    // Notify the other user
    socket.emit('end-call', { roomId: 'example-room-id' });

    // Reset video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [localStream, peer, socket]);

  // Handle incoming call and other events
  const handleIncomingCall = useCallback(async (data) => {
    // ... existing incoming call logic
  }, [peer, socket]);

  const handleCallAccepted = useCallback(async (data) => {
    // ... existing call accepted logic
  }, [peer]);

  // Listen for "end-call" event
  useEffect(() => {
    socket.on('end-call', () => {
      console.log('Call ended by the other user.');
      endCall();
    });

    return () => {
      socket.off('end-call');
    };
  }, [socket, endCall]);

  useEffect(() => {
    startLocalStream();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Video Call Room</h2>
      <div style={styles.videoContainer}>
        {/* Local Video */}
        <div style={styles.videoWrapper}>
          <h3 style={styles.videoLabel}>Your Video</h3>
          <video ref={localVideoRef} autoPlay muted style={styles.video} />
        </div>

        {/* Remote Video */}
        <div style={styles.videoWrapper}>
          <h3 style={styles.videoLabel}>Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay style={styles.video} />
        </div>
      </div>

      {/* End Call Button */}
      <button onClick={endCall} style={styles.endCallButton}>
        End Call
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '1200px',
    margin: 'auto',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    fontWeight: 'bold',
  },
  videoContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: '20px',
  },
  videoWrapper: {
    textAlign: 'center',
    width: '45%',
    borderRadius: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  videoLabel: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#555',
  },
  video: {
    width: '100%',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  endCallButton: {
    marginTop: '20px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
};

export default Room;

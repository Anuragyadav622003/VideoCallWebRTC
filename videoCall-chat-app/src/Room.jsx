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
    <div>
      <h2>Video Call Room</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Local Video */}
        <div>
          <h3>Your Video</h3>
          <video ref={localVideoRef} autoPlay muted style={{ width: '300px', borderRadius: '10px' }} />
        </div>

        {/* Remote Video */}
        <div>
          <h3>Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay style={{ width: '300px', borderRadius: '10px' }} />
        </div>
      </div>

      {/* End Call Button */}
      <button onClick={endCall} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        End Call
      </button>
    </div>
  );
}

export default Room;

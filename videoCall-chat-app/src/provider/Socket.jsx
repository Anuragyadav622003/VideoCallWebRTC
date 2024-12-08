import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    return io('https://video-call-web-rtc-kappa.vercel.app/', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

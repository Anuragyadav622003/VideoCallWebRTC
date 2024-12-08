import React, { createContext, useContext, useMemo } from 'react';

const PeerContext = createContext(null);

export const usePeer = () => useContext(PeerContext);

const PeerProvider = ({ children }) => {
  const peer = useMemo(() => new RTCPeerConnection({
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302'],
      },
    ],
  }), []);

  const createOffer = async () => {
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  return (
    <PeerContext.Provider value={{ peer, createOffer }}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;

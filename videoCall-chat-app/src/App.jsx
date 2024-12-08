import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './Homepage';
import Room from './Room';
import SocketProvider from './provider/Socket';
import PeerProvider from './provider/Peer';

const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/room/:id', element: <Room /> },
]);

function App() {
  return (
    <SocketProvider>
      <PeerProvider>
        <RouterProvider router={router} />
      </PeerProvider>
    </SocketProvider>
  );
}

export default App;

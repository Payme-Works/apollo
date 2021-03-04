import { useEffect, useRef, MutableRefObject } from 'react';

import { useAuthentication } from '@/context/authentication';

import ws, { fakeConnection } from '../services/websocket';

const useWebSocket = (
  room?: string,
  onConnect?: (socket: SocketIOClient.Socket) => void,
): MutableRefObject<SocketIOClient.Socket> => {
  const socket = useRef<SocketIOClient.Socket>(fakeConnection());
  const lastRoom = useRef<string>(null);

  const { user } = useAuthentication();

  useEffect(() => {
    const disconnect = () => {
      socket.current.disconnect();
    };

    if (!user) {
      return disconnect;
    }

    const newSocket = ws({
      user_id: user.id,
    });

    if (lastRoom.current) {
      newSocket.io.emit('leave', lastRoom.current);
    }

    newSocket.emit('join', room);

    if (onConnect) {
      onConnect(newSocket);
    }

    console.log(
      `Successfully connected to websocket, joined to channel: '${room}'.`,
    );

    socket.current = newSocket;
    lastRoom.current = room;

    return disconnect;
  }, [onConnect, room, user]);

  return socket;
};

export default useWebSocket;

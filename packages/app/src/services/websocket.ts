import io from 'socket.io-client';

interface ConnectOptions {
  user_id: string;
}

export const fakeConnection = (): SocketIOClient.Socket =>
  io({ autoConnect: false });

function ws({ user_id }: ConnectOptions): SocketIOClient.Socket {
  return io(process.env.KORE_WS_URL, {
    query: {
      user_id: `apollo@${user_id}`,
    },
  });
}

export default ws;

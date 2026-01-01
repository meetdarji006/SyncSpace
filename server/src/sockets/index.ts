import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
// import { registerChannelEvents } from './channelEvents';
// import { registerPrivateEvents } from './privateEvents';
// import { registerPresence } from './presence';
// import { redisClient } from '../config/redis';

export class SocketService {
  private io: SocketIOServer;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.auth.userId;
      if (!userId) return socket.disconnect();

      console.log('New client connected:', socket.id);

      // Presence tracking
      // registerPresence(socket, userId);

      // Channel events
      // registerChannelEvents(this.io, socket);

      // Private messages
      // registerPrivateEvents(this.io, socket);
    });
  }
}

import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketService {
  private io: SocketIOServer;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', // Adjust this in production
        methods: ['GET', 'POST']
      }
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected:', socket.id);

      socket.on('message', (message: string) => {
        console.log(`Received from ${socket.id}:`, message);

        // Echo back
        socket.emit('message', { type: 'echo', data: `Server received: ${message}` });

        // Broadcast
        socket.broadcast.emit('message', { type: 'broadcast', data: message });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
}

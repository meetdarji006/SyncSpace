import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export let io: SocketIOServer;

export class SocketService {
  constructor(server: HttpServer) {
    io = new SocketIOServer(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    io.on('connection', (socket: Socket) => {
      console.log('New client connected:', socket.id);


      socket.on('join_channel', (channelId: string) => {
        socket.join(channelId);
        console.log(`Socket ${socket.id} joined channel ${channelId}`);
      });

      socket.on('join_user', (userId: string) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room ${userId}`);
      });

      socket.on('leave_channel', (channelId: string) => {
        socket.leave(channelId);
         console.log(`Socket ${socket.id} left channel ${channelId}`);
      });

      // Video Call Signaling
      socket.on('join_call', (channelId: string) => {
          const roomName = `call:${channelId}`;
          const usersInRoom = io.sockets.adapter.rooms.get(roomName);
          const otherUsers = usersInRoom ? Array.from(usersInRoom).filter(id => id !== socket.id) : [];

          socket.join(roomName);
          socket.emit('all_users_in_call', otherUsers);

          console.log(`Socket ${socket.id} joined call in ${channelId}`);
      });

      socket.on('sending_signal', (payload: { userToSignal: string; callerID: string; signal: any }) => {
          io.to(payload.userToSignal).emit('user_joined_call', {
              signal: payload.signal,
              callerID: payload.callerID
          });
      });

      socket.on('returning_signal', (payload: { callerID: string; signal: any; id: string }) => { // id is the reponding socket id
          io.to(payload.callerID).emit('receiving_returned_signal', {
              signal: payload.signal,
              id: socket.id
          });
      });

      socket.on('leave_call', (channelId: string) => {
          const roomName = `call:${channelId}`;
          socket.leave(roomName);
          // Notify others? Usually simpler to handle connection close on client or handle disconnect
          socket.to(roomName).emit('user_left_call', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        // We might want to loop through all rooms this socket was in, but 'user_left_call' logic usually relies on explicit leave or peer connection failure.
        // But for cleaning up UI, broadcasting disconnection is good.
        // It's hard to know which call room they were in without tracking state.
        // For now, simple-peer will detect connection close.
        // But to remove the video element, we need a signal.
        // io.emit('user_disconnected', socket.id); // This is global, might be too much.
      });
      // We can iterate socket.rooms before disconnect triggers if we want, but 'disconnecting' event.
    });

    io.on('disconnecting', (socket: Socket) => {
        for (const room of socket.rooms) {
            if (room.startsWith('call:')) {
                socket.to(room).emit('user_left_call', socket.id);
            }
        }
    });

    // Need to re-bind 'connection' because I replaced the block.
    // Wait, I am replacing inside setupListeners.
  }
}

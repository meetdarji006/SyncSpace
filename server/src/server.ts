import http from 'http';
import dotenv from 'dotenv';
import { createApp } from './app';
import { SocketService } from './services/socketService';

dotenv.config();

const port = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);

// Initialize Socket.io
new SocketService(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

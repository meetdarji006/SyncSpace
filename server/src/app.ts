import express, { Express, Request, Response } from 'express';
import cors from 'cors';


import organizationRoutes from './routes/organizationRoutes';
import channelRoutes from './routes/channelRoutes';
import directMessageRoutes from './routes/directMessageRoutes';
import uploadRoutes from './routes/uploadRoutes';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('Server is running with TypeScript & Socket.io');
  });


  app.use('/api/organizations', organizationRoutes);
  app.use('/api/channels', channelRoutes);
  app.use('/api/direct-messages', directMessageRoutes);
  app.use('/api/upload', uploadRoutes);

  return app;
};

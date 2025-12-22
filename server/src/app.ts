import express, { Express, Request, Response } from 'express';
import cors from 'cors';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('Server is running with TypeScript & Socket.io');
  });

  return app;
};

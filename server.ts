import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from 'errorhandler';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';

import IndexRouter from './src/index';
import { SocketIOService } from './src/services/socket-io/socket-io.services';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Implementation Socket IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler({ log: true }));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(IndexRouter);

io.on('connection', (socket) => {
  /// Indicate uesr already connected on home page
  SocketIOService.onConnect(socket);

  /// Listen typing chat event
  SocketIOService.onTypingMessage(socket);

  /// Listen send message chat event
  SocketIOService.onSendingMessage(socket);

  /// Indicate user already disconnected on home page
  SocketIOService.onCustomDisconnect(socket);

  /// native socket io event disconnect
  SocketIOService.onDisconnect(socket);
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

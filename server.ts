import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from 'errorhandler';
import IndexRouter from './src/index';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { EMIT_EVENT_CONNECT, EMIT_EVENT_DISCONNECT } from './src/utils/constant';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  socket.on(EMIT_EVENT_CONNECT, async (userId) => {
    if (userId) {
      console.log(`[server]: User ${userId} connected`);
    }
  });

  /// Indicate user already disconnected on home page
  socket.on(EMIT_EVENT_DISCONNECT, (userId) => {
    if (userId) {
      console.log(`[server]: User ${userId} disconnected`);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

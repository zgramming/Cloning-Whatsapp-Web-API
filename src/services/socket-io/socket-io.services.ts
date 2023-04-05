import { Socket } from 'socket.io';

import { PrismaClient } from '@prisma/client';

import { SocketIOMessageCreateResponseInterface } from '../../interfaces/socket-io.message.create-response.interface';
import {
  EMIT_EVENT_CONNECT,
  EMIT_EVENT_DISCONNECT,
  EMIT_EVENT_SEND_MESSAGE,
  EMIT_EVENT_TYPING,
} from '../../utils/constant';

const prisma = new PrismaClient();

export class SocketIOService {
  static async onConnect(socket: Socket) {
    socket.on(EMIT_EVENT_CONNECT, async (userId) => {
      if (userId) {
        const groups = await prisma.groupMember.findMany({
          select: {
            group_id: true,
          },
          where: { user_id: userId },
        });

        const idsGroup = groups.map((group) => group.group_id);

        console.log(`[Socket IO Server]: User ${userId} connected and join to group ${idsGroup}`);
        socket.join(idsGroup);
      }
    });
  }

  static async onTypingMessage(socket: Socket) {
    socket.on(EMIT_EVENT_TYPING, (data) => {
      const { userId, groupId, message } = data;
      console.log(`[Socket IO Server]: User ${userId} is typing in group ${groupId} with message ${message}`);

      socket.broadcast.to(groupId).emit(EMIT_EVENT_TYPING, data);
    });
  }

  static async onSendingMessage(socket: Socket) {
    socket.on(EMIT_EVENT_SEND_MESSAGE, (data: SocketIOMessageCreateResponseInterface) => {
      const { data: dataResponse } = data;
      const { group_id, from } = dataResponse;

      console.log(`[Socket IO Server]: User ${from} send message to group ${group_id}`);

      socket.broadcast.to(group_id).emit(EMIT_EVENT_SEND_MESSAGE, data);
    });
  }

  static async onDisconnect(socket: Socket) {
    socket.on(EMIT_EVENT_DISCONNECT, async (userId) => {
      if (userId) {
        const groups = await prisma.groupMember.findMany({
          select: {
            group_id: true,
          },
          where: { user_id: userId },
        });

        const idsGroup = groups.map((group) => group.group_id);

        console.log(`[Socket IO Server]: User ${userId} disconnected`);

        idsGroup.forEach((id) => {
          socket.leave(id);

          console.log(`[Socket IO Server]: User ${userId} leave group ${id}`);
        });
      }
    });
  }
}

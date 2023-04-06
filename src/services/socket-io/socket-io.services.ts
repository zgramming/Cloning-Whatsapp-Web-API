import { Socket } from 'socket.io';

import { PrismaClient } from '@prisma/client';

import { SocketIOChannelInterface } from '../../interfaces/socket-io.channel.interface';
import { SocketIOGroupInviteInterface } from '../../interfaces/socket-io.group.invite.interface';
import { SocketIOMessageCreateResponseInterface } from '../../interfaces/socket-io.message.create-response.interface';
import { SocketIOMessageTypingInterface } from '../../interfaces/socket-io.message.typing.interface';
import {
  EMIT_EVENT_CONNECT,
  EMIT_EVENT_CUSTOM_DISCONNECT,
  EMIT_EVENT_INVITE_NEW_GROUP,
  EMIT_EVENT_SEND_MESSAGE,
  EMIT_EVENT_TYPING,
} from '../../utils/constant';

const prisma = new PrismaClient();

/// list of user id connected
export let channels: SocketIOChannelInterface = {};

export class SocketIOService {
  static async onConnect(socket: Socket) {
    socket.on(EMIT_EVENT_CONNECT, async (userId) => {
      if (userId) {
        /// Add socket connection into object channels

        channels[userId] = socket;

        /// Join own group
        socket.join(userId);

        /// If have group, join to group
        const groups = await prisma.groupMember.findMany({
          select: {
            group_id: true,
          },
          where: { user_id: userId },
        });

        if (groups.length === 0) {
          console.log(`[Socket IO Server]: User ${userId} connected and not join to any group`);
          return;
        }

        const idsGroup = groups.map((group) => group.group_id);

        console.log(`[Socket IO Server]: User ${userId} connected and join to group ${idsGroup}`);

        socket.join(idsGroup);
      }
    });
  }

  static async onInviteNewGroup(socket: Socket) {
    socket.on(EMIT_EVENT_INVITE_NEW_GROUP, async (data: SocketIOGroupInviteInterface) => {
      const { group_id, invited_by } = data;

      const groupMember = await prisma.groupMember.findMany({
        select: { user_id: true },
        where: {
          group_id,
        },
      });
      const groupMemberUserIds = groupMember.map((member) => member.user_id);

      for (const userId of groupMemberUserIds) {
        const channelSocket = channels[userId];

        if (channelSocket) {
          // Join user to group channel
          channelSocket.join(group_id);

          // Only emit to inviter user
          if (userId !== invited_by) {
            channelSocket.to(userId).emit(EMIT_EVENT_INVITE_NEW_GROUP, data);
          }
        }
      }

      groupMemberUserIds.forEach((userId) => {
        const channelSocket = channels[userId];
        if (channelSocket) {
          channelSocket.join(group_id);
          channelSocket.emit(EMIT_EVENT_INVITE_NEW_GROUP, data);
        }
      });
    });
  }

  static async onTypingMessage(socket: Socket) {
    socket.on(EMIT_EVENT_TYPING, (data: SocketIOMessageTypingInterface) => {
      const { name, group_id, is_typing } = data;
      const isTyping = is_typing ? 'is typing...' : 'stop typing...';
      console.log(`[Socket IO Server]: User ${name} ${isTyping} in group ${group_id} ...`);

      socket.broadcast.to(group_id).emit(EMIT_EVENT_TYPING, data);
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

  static async onCustomDisconnect(socket: Socket) {
    socket.on(EMIT_EVENT_CUSTOM_DISCONNECT, async (userId) => {
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

  static async onDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  }
}

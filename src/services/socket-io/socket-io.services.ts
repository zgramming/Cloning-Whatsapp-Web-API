import { Socket } from 'socket.io';

import { PrismaClient } from '@prisma/client';

import { SocketIOChannelInterface } from '../../interfaces/socket-io.channel.interface';
import { SocketIOMessageCreateResponseInterface } from '../../interfaces/socket-io.message.create-response.interface';
import { SocketIOMessageTypingInterface } from '../../interfaces/socket-io.message.typing.interface';
import {
  EMIT_EVENT_CONNECT,
  EMIT_EVENT_CUSTOM_DISCONNECT,
  EMIT_EVENT_INVITE_NEW_CONVERSATION,
  EMIT_EVENT_SEND_MESSAGE,
  EMIT_EVENT_TYPING,
} from '../../utils/constant';
import { SocketIOInviteConversationInterface } from '../../interfaces/socket-io.group.invite.interface';

const prisma = new PrismaClient();

/// list of user id connected
export let channels: SocketIOChannelInterface = {};

export class SocketIOService {
  static async onConnect(socket: Socket) {
    socket.on(EMIT_EVENT_CONNECT, async (userId) => {
      if (userId) {
        /// Add socket connection into object channels

        channels[userId] = socket;

        /// Join own conversation
        socket.join(userId);

        /// If have conversation, join to conversation
        const conversations = await prisma.conversationParticipant.findMany({
          select: {
            conversation_id: true,
          },
          where: { user_id: userId },
        });

        if (conversations.length === 0) {
          console.log(`[Socket IO Server]: User ${userId} connected and join to own conversation`);
          return;
        }

        const idsConversation = conversations.map((conversation) => conversation.conversation_id);

        console.log(`[Socket IO Server]: User ${userId} connected and join to group ${idsConversation}`);

        socket.join(idsConversation);
      }
    });
  }

  static async onInviteNewConversation(socket: Socket) {
    socket.on(EMIT_EVENT_INVITE_NEW_CONVERSATION, async (data: SocketIOInviteConversationInterface) => {
      const { conversation_id, invited_by } = data;

      const participants = await prisma.conversationParticipant.findMany({
        select: { user_id: true },
        where: {
          conversation_id,
        },
      });

      const participantsUserId = participants.map((participant) => participant.user_id);

      for (const userId of participantsUserId) {
        const channelSocket = channels[userId];

        if (channelSocket) {
          // Join to conversation channel
          channelSocket.join(conversation_id);

          // Send notification to user invited by other user in conversation channel (except user invited by)
          if (userId !== invited_by) {
            socket.to(userId).emit(EMIT_EVENT_INVITE_NEW_CONVERSATION, data);
          }
        }
      }
    });
  }

  static async onTypingMessage(socket: Socket) {
    socket.on(EMIT_EVENT_TYPING, (data: SocketIOMessageTypingInterface) => {
      const { name, conversation_id, is_typing } = data;
      const isTyping = is_typing ? 'is typing...' : 'stop typing...';

      console.log(`[Socket IO Server]: User ${name} ${isTyping} in conversation ${conversation_id}`);

      socket.broadcast.to(conversation_id).emit(EMIT_EVENT_TYPING, data);
    });
  }

  static async onSendingMessage(socket: Socket) {
    socket.on(EMIT_EVENT_SEND_MESSAGE, (data: SocketIOMessageCreateResponseInterface) => {
      const { data: dataResponse } = data;

      const { conversation_id, from } = dataResponse;

      console.log(`[Socket IO Server]: User ${from} send message to conversation ${conversation_id}`);

      socket.broadcast.to(conversation_id).emit(EMIT_EVENT_SEND_MESSAGE, data);
    });
  }

  static async onCustomDisconnect(socket: Socket) {
    socket.on(EMIT_EVENT_CUSTOM_DISCONNECT, async (userId) => {
      if (userId) {
        const conversations = await prisma.conversationParticipant.findMany({
          select: {
            conversation_id: true,
          },
          where: { user_id: userId },
        });

        const idsConversation = conversations.map((conversation) => conversation.conversation_id);

        console.log(`[Socket IO Server]: User ${userId} disconnected`);

        idsConversation.forEach((id) => {
          socket.leave(id);

          console.log(`[Socket IO Server]: User ${userId} leave group ${id}`);
        });
      }
    });
  }

  static async onDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      console.log(`[Socket IO Server]: User disconnected`);
    });
  }
}

import { PrismaClient } from '@prisma/client';
import { MessageCreateDTO } from './message.dto';

const prisma = new PrismaClient();

export class MessageService {
  static async getByConversationId(conversation_id: string) {
    const messages = await prisma.message.findMany({
      where: {
        conversation_id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return messages;
  }

  static async create({ from, conversation_id, message, type }: MessageCreateDTO) {
    const transaction = await prisma.$transaction(async (trx) => {
      // Update last message and last sender
      await trx.conversation.update({
        where: {
          id: conversation_id,
        },
        data: {
          last_msg: message,
          last_sender: from,
          updated_at: new Date(),
        },
      });

      // Create message
      const messageCreated = await trx.message.create({
        data: {
          from,
          conversation_id,
          message,
          type,
        },
      });

      return messageCreated;
    });

    return transaction;
  }
}

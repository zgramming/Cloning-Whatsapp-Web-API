import { PrismaClient } from '@prisma/client';
import { MessageCreateDTO } from './message.dto';

const prisma = new PrismaClient();

export class MessageService {
  static async getByGroupId(groupId: string) {
    const messages = await prisma.message.findMany({
      where: {
        group_id: groupId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return messages;
  }

  static async create({ from, group_id, message, type }: MessageCreateDTO) {
    const transaction = await prisma.$transaction(async (trx) => {
      // Update last message and last sender
      const groupUpdateLastMessage = await trx.group.update({
        where: {
          id: group_id,
        },
        data: {
          last_msg: message,
          last_sender: from,
        },
      });

      // Create message
      const messageCreated = await trx.message.create({
        data: {
          from,
          group_id,
          message,
          type,
        },
      });

      return messageCreated;
    });

    return transaction;
  }
}

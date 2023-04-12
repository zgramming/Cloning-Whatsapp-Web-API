import { PrismaClient } from '@prisma/client';

import ResponseError from '../../interfaces/response-error.interface';
import { CODE_GROUP_CONVERSATION, CODE_PRIVATE_CONVERSATION } from '../../utils/constant';
import {
  ConversationCreateDTO,
  ConversationGroupCreateDTO,
  ConversationPrivateCreateDTO,
  ConversationUpdateDTO,
  ConversationUpdateLastMessageDTO,
} from './conversation.dto';

const prisma = new PrismaClient();

export class ConversationService {
  static async getById(id: string) {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        participants: {
          select: {
            user_id: true,
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    return conversation;
  }

  static async getByCode(code: string) {
    const conversation = await prisma.conversation.findUnique({
      where: {
        code,
      },
    });
    return conversation;
  }

  static async getMyConversations(userId: string) {
    // With this function, we accomodir to fetch private, public, and group chat
    // To accomodir private / public group, we just need to get 1 member of group
    // To accomodate group chat, we need last sender with relation to user

    const conversations = await prisma.conversation.findMany({
      where: {
        last_msg: {
          not: null,
        },
        participants: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        // TODO:  We have to figure out how to check if the user is already in contact or not
        _count: {
          select: {
            contact: true,
          },
        },
        participants: {
          /// We don't need to get all members, just get 1 member to accomodate private / public group
          take: 1,
          where: {
            user_id: {
              not: userId,
            },
          },
          select: {
            user_id: true,
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    const mapping = conversations.map((conversation) => {
      if (conversation.type === 'PRIVATE') {
        const isHaveInterlocutors = conversation.participants.length > 0;
        const interlocutors = isHaveInterlocutors ? conversation.participants[0].user : null;
        const alreadyOnContact = conversation._count.contact > 0;
        const result = {
          ...conversation,
          interlocutors: {
            ...interlocutors,
            already_on_contact: alreadyOnContact,
          },
        };

        return result;
      }

      return conversation;
    });

    return mapping;
  }

  static async createPrivateConversation({ userId, yourId }: ConversationPrivateCreateDTO) {
    /// If group id is not exists, create new group
    const name = `Private Group ${yourId}_${userId}`;
    const code = CODE_PRIVATE_CONVERSATION({ yourId, userId });
    const alternativeCode = CODE_PRIVATE_CONVERSATION({ yourId: userId, userId: yourId });

    const isExists = await prisma.conversation.findFirst({
      where: {
        OR: [{ code }, { code: alternativeCode }],
      },
    });

    if (isExists) {
      const error = new Error('Conversation is already exist') as ResponseError;
      error.status = 400;
      throw error;
    }

    // Create group with members (yourId, userId) and return group
    const result = await prisma.conversation.create({
      data: {
        name,
        code,
        type: 'PRIVATE',
        participants: {
          createMany: {
            data: [
              {
                user_id: yourId,
              },
              {
                user_id: userId,
              },
            ],
          },
        },
      },
    });

    return result;
  }

  static async createGroupConversation({ creatorId, name, participants, avatar }: ConversationGroupCreateDTO) {
    const code = CODE_GROUP_CONVERSATION(creatorId);

    const result = await prisma.conversation.create({
      data: {
        name,
        code,
        type: 'GROUP',
        avatar: avatar?.filename || null,
        participants: {
          createMany: {
            data: participants.map((participant) => ({
              user_id: participant,
            })),
          },
        },
      },
    });

    return result;
  }

  static async updateLastMessage({ conversation_id, last_sender, message }: ConversationUpdateLastMessageDTO) {
    const result = await prisma.conversation.update({
      where: {
        id: conversation_id,
      },
      data: {
        last_msg: message,
        last_sender,
      },
    });

    return result;
  }

  static async update(id: string, { name, avatar }: ConversationUpdateDTO) {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const result = await prisma.conversation.update({
      where: {
        id,
      },
      data: {
        name: name,
        avatar: avatar,
        code: conversation.code,
        type: conversation.type,
      },
    });

    return result;
  }

  static async delete(id: string) {
    const result = await prisma.conversation.delete({
      where: {
        id,
      },
    });
    return result;
  }
}

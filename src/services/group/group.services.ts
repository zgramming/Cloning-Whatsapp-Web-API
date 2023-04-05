import { PrismaClient } from '@prisma/client';

import ResponseError from '../../interfaces/response-error.interface';
import { CODE_PRIVATE_GROUP } from '../../utils/constant';
import { GroupCreateDTO, GroupPrivateCreateDTO, GroupUpdateDTO, GroupUpdateLastMessageDTO } from './group.dto';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});
export class GroupService {
  static async getGroupById(id: string) {
    const group = await prisma.group.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        group_member: {
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

    return group;
  }

  static async getGroupByCode(code: string) {
    const group = await prisma.group.findUnique({
      where: {
        code,
      },
    });
    return group;
  }

  static async getMyGroups(userId: string) {
    // With this function, we accomodir to fetch private, public, and group chat
    // To accomodir private / public group, we just need to get 1 member of group
    // To accomodate group chat, we need last sender with relation to user

    const groups = await prisma.group.findMany({
      where: {
        last_msg: {
          not: null,
        },
        group_member: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        group_member: {
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

    const mapping = groups.map((group) => {
      if (group.type === 'PRIVATE') {
        return {
          ...group,
          interlocutors: group.group_member[0].user,
        };
      }

      return group;
    });

    return mapping;
  }

  static async createPrivateGroup({ userId, yourId }: GroupPrivateCreateDTO) {
    /// If group id is not exists, create new group
    const name = `Private Group ${yourId}_${userId}`;
    const code = CODE_PRIVATE_GROUP({ yourId, userId });
    const alternativeCode = CODE_PRIVATE_GROUP({ yourId: userId, userId: yourId });

    const groupIsExist = await prisma.group.findFirst({
      where: {
        OR: [{ code }, { code: alternativeCode }],
      },
    });

    if (groupIsExist) {
      const error = new Error('Group is already exist') as ResponseError;
      error.status = 400;
      throw error;
    }

    // Create group with members (yourId, userId) and return group
    const groupCreated = await prisma.group.create({
      data: {
        name,
        code,
        type: 'PRIVATE',
        group_member: {
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

    return groupCreated;
  }

  static async createGroup(group: GroupCreateDTO) {
    const groupCreated = await prisma.group.create({
      data: {
        name: group.name,
        code: group.code,
        avatar: group.avatar,
        type: group.type,
      },
    });
    return groupCreated;
  }

  static async updateLastMessage({ groupId, last_sender, message }: GroupUpdateLastMessageDTO) {
    const groupUpdated = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        last_msg: message,
        last_sender,
      },
    });

    return groupUpdated;
  }

  static async updateGroup(id: string, group: GroupUpdateDTO) {
    const prevGroup = await prisma.group.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const groupUpdated = await prisma.group.update({
      where: {
        id,
      },
      data: {
        name: group.name,
        avatar: group.avatar,
        code: prevGroup.code,
        type: prevGroup.type,
      },
    });

    return groupUpdated;
  }

  static async deleteGroup(id: string) {
    const groupDeleted = await prisma.group.delete({
      where: {
        id,
      },
    });
    return groupDeleted;
  }
}

import { PrismaClient } from '@prisma/client';

import { GroupCreateDTO, GroupPrivateCreateDTO, GroupUpdateDTO, GroupUpdateLastMessageDTO } from './group.dto';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});
export class GroupService {
  static async getGroupById(id: string) {
    const group = await prisma.group.findUnique({
      where: {
        id,
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

  static async getAllGroups() {
    const groups = await prisma.group.findMany();
    return groups;
  }

  static async getMyGroup(userId: string) {
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
    });

    return groups;
  }

  static async createPrivateGroup({ userId, yourId }: GroupPrivateCreateDTO) {
    /// If group id is not exists, create new group
    const name = `Private Group ${yourId}_${userId}`;
    const code = `PRIVATE_${yourId}_${userId}`;

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
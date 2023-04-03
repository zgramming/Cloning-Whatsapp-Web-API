import { PrismaClient } from '@prisma/client';

import { GroupCreateDTO, GroupUpdateDTO } from './group.dto';

const prisma = new PrismaClient();
export class GroupService {
  static async createGroup(group: GroupCreateDTO) {
    const transaction = await prisma.$transaction(async (trx) => {});

    if (group.type === 'PRIVATE' || group.type === 'PUBLIC') {
    }

    if (group.type === 'GROUP') {
    }

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

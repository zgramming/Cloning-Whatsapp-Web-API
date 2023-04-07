import { hashSync } from 'bcrypt';

import { PrismaClient } from '@prisma/client';

import ResponseError from '../../interfaces/response-error.interface';
import { UserCreateDTO, UserUpdateDTO } from './user.dto';
import { CODE_PRIVATE_GROUP } from '../../utils/constant';

const saltRounds = 10;
const prisma = new PrismaClient();

export class UserService {
  static async getAllUsers() {
    const result = await prisma.user.findMany();
    return result;
  }

  static async getUserById(id: string) {
    const result = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  static async getUserByPhone({ phone, userId }: { phone: string; userId: string }) {
    const result = await prisma.user.findFirstOrThrow({
      where: {
        phone: {
          equals: phone,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        avatar: true,
      },
    });

    const userAlreadyInMyGroup = await prisma.group.findFirst({
      where: {
        OR: [
          {
            code: CODE_PRIVATE_GROUP({
              yourId: userId,
              userId: result.id,
            }),
          },
          {
            code: CODE_PRIVATE_GROUP({
              yourId: result.id,
              userId,
            }),
          },
        ],
      },
    });

    return {
      result,
      userAlreadyInMyGroup,
    };
  }

  static async createUser(body: UserCreateDTO) {
    const phoneIsExist = await prisma.user.findUnique({
      where: {
        phone: body.phone,
      },
    });

    if (phoneIsExist) {
      const error = new Error('Phone is already exist') as ResponseError;
      error.status = 400;
      throw error;
    }

    const result = await prisma.user.create({
      data: {
        name: body.name,
        password: hashSync(body.password, saltRounds),
        phone: body.phone,
        avatar: body.avatar,
        status: body.status,
      },
    });

    return result;
  }

  static async updateUser(id: string, { name, bio }: UserUpdateDTO) {
    const result = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        bio,
      },
    });

    return result;
  }

  static async updateAvatar(id: string, avatar: string) {
    const result = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        avatar,
      },
    });

    return result;
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

// Path: src\services\group.services.ts

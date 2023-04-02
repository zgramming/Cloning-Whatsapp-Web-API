import { hashSync } from 'bcrypt';

import { PrismaClient } from '@prisma/client';

import { UserCreateDTO, UserUpdateDTO } from './user.dto';

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

  static async createUser(body: UserCreateDTO) {
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

  static async updateUser(id: string, body: UserUpdateDTO) {
    return prisma.user.update({
      where: {
        id: id,
      },
      data: {
        avatar: body.avatar,
        name: body.name,
      },
    });
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

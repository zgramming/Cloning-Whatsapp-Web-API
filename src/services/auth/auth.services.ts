import { PrismaClient } from '@prisma/client';
import { compareSync } from 'bcrypt';
import ResponseError from '../../interfaces/response-error.interface';
import { AuthLoginDTO } from './auth.dto';

const prisma = new PrismaClient();

export class AuthService {
  static async login(body: AuthLoginDTO) {
    const result = await prisma.user.findUnique({
      where: {
        phone: body.phone,
      },
    });

    if (!result) {
      const error = new Error('User not found') as ResponseError;
      error.status = 404;
      throw error;
    }

    const checkPassword = compareSync(body.password, result.password);

    if (!checkPassword) {
      const error = new Error('Password is not correct') as ResponseError;
      error.status = 401;
      throw error;
    }

    return result;
  }
}

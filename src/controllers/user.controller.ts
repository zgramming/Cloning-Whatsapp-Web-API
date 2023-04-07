import { Request, Response } from 'express';
import { unlinkSync } from 'fs';

import { UserService } from '../services/user/user.services';
import { PATH_ACTUAL_AVARTAR, PATH_TEMPORARY_AVARTAR } from '../utils/constant';
import { CustomError, errorHandler } from '../utils/error.helper';
import { FN } from '../utils/function';
import { getUserIdFromToken } from '../utils/token.helper';

export class UserController {
  static async getUser(req: Request, res: Response) {
    const result = await UserService.getUserById(req.params.id);

    return res.status(200).json({
      message: 'User',
      success: true,
      data: result,
    });
  }

  static async getAllUsers(req: Request, res: Response) {
    const result = await UserService.getAllUsers();

    return res.status(200).json({
      message: 'All users',
      success: true,
      data: result,
    });
  }

  static async getUserByPhone(req: Request, res: Response) {
    try {
      const { phone } = req.params;
      const userId = getUserIdFromToken({ req }) || '';
      const { result, userAlreadyInMyGroup } = await UserService.getUserByPhone({
        phone,
        userId,
      });

      return res.status(200).json({
        message: 'User',
        success: true,
        data: result,
        group: userAlreadyInMyGroup,
      });
    } catch (error) {
      return errorHandler(error, req, res);
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const result = await UserService.createUser(req.body);

      return res.status(200).json({
        success: true,
        message: 'User created successfully',
        data: result,
      });
    } catch (err) {
      return errorHandler(err, req, res);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = getUserIdFromToken({ req }) || '';
      const { name, bio } = req.body;
      const result = await UserService.updateUser(id, {
        name,
        bio,
      });

      return res.status(200).json({
        message: 'User updated successfully',
        success: true,
        data: result,
      });
    } catch (error) {
      return errorHandler(error, req, res);
    }
  }

  static async updatePicture(req: Request, res: Response) {
    try {
      const id = getUserIdFromToken({ req }) || '';
      const user = await UserService.getUserById(id);
      const avatar = req.file;

      if (!avatar) {
        throw CustomError('Avatar is required', 400);
      }

      const result = await UserService.updatePicture(id, avatar);

      const from = `${PATH_TEMPORARY_AVARTAR}/${avatar.filename}`;
      const to = `${PATH_ACTUAL_AVARTAR}/${result.avatar}`;

      /// Remove old avatar if exists
      if (user.avatar) {
        unlinkSync(`${PATH_ACTUAL_AVARTAR}/${user.avatar}`);
      }

      /// Move file from temporary folder to actual folder
      FN.moveAndDeleteOldFile(from, to);

      return res.status(200).json({
        message: 'User updated successfully',
        success: true,
        data: result,
      });
    } catch (error) {
      return errorHandler(error, req, res);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const id = getUserIdFromToken({ req }) || '';
      const result = await UserService.deleteUser(id);

      return res.status(200).json({
        message: 'User deleted successfully',
        success: true,
        data: result,
      });
    } catch (error) {
      return errorHandler(error, req, res);
    }
  }
}

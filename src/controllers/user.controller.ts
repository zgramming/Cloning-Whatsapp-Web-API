import { Request, Response } from 'express';

import { UserService } from '../services/user/user.services';
import { errorHandler } from '../utils/error.helper';

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
    const result = await UserService.getUserByPhone(req.params.phone);

    return res.status(200).json({
      message: 'User',
      success: true,
      data: result,
    });
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
      errorHandler(err, req, res);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const result = await UserService.updateUser(req.params.id, req.body);

      return res.status(200).json({
        message: 'User updated successfully',
        success: true,
        data: result,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
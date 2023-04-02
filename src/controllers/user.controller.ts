import { Request, Response } from 'express';
import { UserService } from '../services/user/user.services';
import { expressValidatorCheck } from '../utils/express-validator.helper';

export class UserController {
  static async getUser(req: Request, res: Response) {
    const result = await UserService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  static async getAllUsers(req: Request, res: Response) {
    const result = await UserService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  static async createUser(req: Request, res: Response) {
    const result = await UserService.createUser(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  static async updateUser(req: Request, res: Response) {
    const result = await UserService.updateUser(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
}

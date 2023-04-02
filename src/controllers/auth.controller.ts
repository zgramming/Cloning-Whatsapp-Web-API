import { Request, Response } from 'express';
import ResponseError from '../interfaces/response-error.interface';
import { AuthService } from '../services/auth/auth.services';
import { errorHandler } from '../utils/error.helper';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(200).json({
        success: true,
        message: 'Login success',
        data: result,
      });
    } catch (err) {
      errorHandler(err, req, res);
    }
  }
}

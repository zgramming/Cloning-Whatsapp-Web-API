import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { verifyToken } from '../utils/token.helper';

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = verifyToken({
      req,
      onErrorToken(message) {
        return res.status(401).json({
          success: false,
          message,
          data: null,
        });
      },
      onErrorVerify(message) {
        return res.status(401).json({
          success: false,
          data: null,
          message,
        });
      },
    });

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Token is expired',
        });
      }

      return res.status(401).json({
        success: false,
        data: null,
        message: error.message,
      });
    }

    return res.status(401).json({
      success: false,
      data: null,
      message: 'Unauthorized',
    });
  }
};

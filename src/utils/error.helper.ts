import { Request, Response } from 'express';
import ResponseError from '../interfaces/response-error.interface';

export const errorHandler = (err: unknown, req: Request, res: Response) => {
  if (err instanceof Error) {
    const { name, message, status } = err as ResponseError;

    return res.status(status).json({
      success: false,
      message: message || name,
      data: null,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null,
  });
};

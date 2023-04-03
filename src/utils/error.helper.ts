import { Request, Response } from 'express';

import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

import ResponseError from '../interfaces/response-error.interface';

export const errorHandler = (err: unknown, req: Request, res: Response) => {
  if (
    err instanceof PrismaClientKnownRequestError ||
    err instanceof PrismaClientUnknownRequestError ||
    err instanceof PrismaClientRustPanicError ||
    err instanceof PrismaClientInitializationError ||
    err instanceof PrismaClientValidationError
  ) {
    console.log({ err });

    return res.status(400).json({
      success: false,
      data: null,
      message: err.message,
      stacktrace: err.stack,
    });
  }

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

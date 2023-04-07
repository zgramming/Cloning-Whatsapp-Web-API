import { Request, Response } from 'express';
import multer from 'multer';

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
    const { name, message, status = 500 } = err as ResponseError;
    return res.status(status).json({
      success: false,
      message: message || name,
      data: null,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      fields: err.field,
      stacktrace: err.stack,
      code: err.code,
      data: null,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null,
  });
};

export const CustomError = (message: string, status: number) => {
  const error = new Error(message) as ResponseError;
  error.status = status;
  return error;
};

// Path: src\utils\error.helper.ts

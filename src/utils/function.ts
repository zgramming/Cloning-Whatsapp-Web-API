import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import multer from 'multer';
import { dirname } from 'path';

import { CustomError } from './error.helper';

type MulterUploadConfig = {
  destination: string;
  limitFileSize: number;
  config: {
    whitelistMimeType: string[];
  };
};

export class FN {
  static uniqueFilename(file: Express.Multer.File) {
    const randomString = Math.round(Math.random() * 1e9);
    const date = new Date();
    const dateFormat = date.toLocaleDateString('id-ID', {
      dateStyle: 'full',
    });
    const timeFormat = date.toLocaleTimeString('id-ID', {
      timeStyle: 'medium',
    });

    const ext = file.originalname.split('.').pop();
    const uniqueName = `${dateFormat}-${timeFormat}-${randomString}.${ext}`;

    return uniqueName;
  }

  static maxSizeInMB(value: number) {
    return value * 1024 * 1024;
  }

  static moveAndDeleteOldFile(from: string, to: string) {
    const dirFrom = dirname(from);
    const dirTo = dirname(to);

    if (!existsSync(dirFrom)) {
      mkdirSync(dirFrom, { recursive: true });
    }

    if (!existsSync(dirTo)) {
      mkdirSync(dirTo, { recursive: true });
    }

    renameSync(from, to);

    // Remove old file
    if (existsSync(from)) {
      unlinkSync(from);
    }
  }

  static multerUploadConfig({ config, destination, limitFileSize }: MulterUploadConfig) {
    const { whitelistMimeType } = config;
    const result = multer({
      storage: multer.diskStorage({
        destination,
        filename: (req, file, cb) => {
          cb(null, FN.uniqueFilename(file));
        },
      }),
      fileFilter(req, file, callback) {
        const mime = file.mimetype;
        if (!whitelistMimeType.includes(mime)) {
          const availableMime = whitelistMimeType.join(', ');
          callback(CustomError(`Invalid Type ${mime}, Available Type ${availableMime}`, 400));
        }

        callback(null, true);
      },
      limits: {
        fileSize: limitFileSize,
      },
    });

    return result;
  }

  static async compressImage() {}
}

import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import { dirname } from 'path';

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

  static async compressImage() {}
}

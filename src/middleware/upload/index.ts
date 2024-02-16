import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

export interface UploadOptions {
  destination: string;
  filename?: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => void;
}

const defaultFilename = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const ext = path.extname(file.originalname);
  callback(null, `${file.fieldname}-${Date.now()}${ext}`);
};

export const uploadMiddleware = (options: UploadOptions) => {
  const storage = multer.diskStorage({
    destination: options.destination,
    filename: options.filename || defaultFilename,
  });

  const upload = multer({ storage: storage }).single('file');

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).send('Multer error occurred.');
      } else if (err) {
        // An unknown error occurred.
        return res.status(500).send('Unknown error occurred.');
      }
      next();
    });
  };
};

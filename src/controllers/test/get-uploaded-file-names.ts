import { Request, Response } from 'express';
import { controller } from '@config/controller/controller';
import fs from 'fs';
// import path from 'path';
// import { IUserRequestObject } from '@modules/users/model';

/**
 * This function is used to get logged in user details
 * @param req
 * @param res
 */
export const getUploadedFileNames = controller(
  async (req: Request, res: Response): Promise<void> => {
    const uploadsFolder = 'D:\\Projects\\Abstract-file-storage\\uploads';

    // Read the contents of the uploads folder
    fs.readdir(uploadsFolder, (err, files) => {
      if (err) {
        return res.status(500).send('Error reading uploads folder');
      }

      res.status(200).json({ filenames: files });
    });
  },
);

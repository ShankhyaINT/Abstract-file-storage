import { Request, Response } from 'express';
import { controller } from '@config/controller/controller';
import fs from 'fs';

/**
 * This function is used to get logged in user details
 * @param req
 * @param res
 */
export const testDelete = controller(async (req: Request, res: Response): Promise<void> => {
  const filename = req.params.filename;
  const uploadsFolder = 'D:\\Projects\\Abstract-file-storage\\uploads';

  const filePath = `${uploadsFolder}\\${filename}`;

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send('Error deleting file');
      }
      res.status(200).send('File deleted successfully');
    });
  });
});

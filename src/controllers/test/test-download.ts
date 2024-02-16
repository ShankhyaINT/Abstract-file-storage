import { Request, Response } from 'express';
import { controller } from '@config/controller/controller';
import fs from 'fs';

/**
 * This function is used to get logged in user details
 * @param req
 * @param res
 */
export const testDownload = controller(async (req: Request, res: Response): Promise<void> => {
  const filename = req.params.filename;
  const uploadsFolder = 'D:\\Projects\\Abstract-file-storage\\uploads';

  const filePath = `${uploadsFolder}\\${filename}`;

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Error accessing file:', err);
      return res.status(404).send('File not found');
    }

    // Set the appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream'); // or specify the appropriate content type

    // Stream the file content to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

import { Router } from 'express';
import { testController } from '@controllers/index';
import { uploadMiddleware, UploadOptions } from '@middleware/index';

const testRouter = Router();

const uploadOptions: UploadOptions = {
  destination: 'uploads/', // Destination folder for uploaded files
  filename: (req, file, callback) => {
    // Custom filename logic if needed
    callback(null, file.originalname);
  },
};

testRouter.post('/upload', uploadMiddleware(uploadOptions), testController.testUpload);

testRouter.get('/get-uploaded-file-names', testController.getUploadedFileNames);

testRouter.delete('/delete/:filename', testController.testDelete);

testRouter.get('/download/:filename', testController.testDownload);

export { testRouter };

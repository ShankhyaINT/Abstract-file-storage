import { Request, RequestHandler } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

interface ObjectMetadata {
  Key: string;
  LastModified: Date;
  Size: number;
}

interface CopyObjectResult {
  status: string;
}

interface StorageResponse<T> {
  Location?: string;
  Key?: string;
  Bucket?: string;
  Contents?: ObjectMetadata[];
  Body?: Buffer;
  CopyObjectResult?: CopyObjectResult;
  Data?: T;
}

class FileStorageService {
  private readonly baseFolder: string;
  private readonly uploadDirectory: string;
  private readonly upload: multer.Multer;

  constructor(baseFolder: string, uploadDirectory: string) {
    this.baseFolder = baseFolder;
    this.uploadDirectory = path.join(baseFolder, uploadDirectory);
    this.upload = multer({ dest: this.uploadDirectory });
    // Ensure that the base folder and upload directory exist
    if (!fs.existsSync(this.baseFolder)) {
      fs.mkdirSync(this.baseFolder, { recursive: true });
    }
    if (!fs.existsSync(this.uploadDirectory)) {
      fs.mkdirSync(this.uploadDirectory, { recursive: true });
    }
  }

  async uploadFiles(req: Request): Promise<StorageResponse<undefined>> {
    const files = (req.files as Express.Multer.File[]) || [];
    const uploadedFiles: string[] = [];
    for (const file of files) {
      const filePath = path.join(this.uploadDirectory, file.originalname);
      await fs.promises.rename(file.path, filePath);
      uploadedFiles.push(filePath);
    }
    return {
      Location: this.uploadDirectory,
      Bucket: this.uploadDirectory,
    };
  }

  async listFiles(): Promise<StorageResponse<ObjectMetadata[]>> {
    const files = await fs.promises.readdir(this.uploadDirectory);
    const contents: ObjectMetadata[] = await Promise.all(
      files.map(async (fileName) => {
        const stats = await fs.promises.stat(path.join(this.uploadDirectory, fileName));
        return {
          Key: fileName,
          LastModified: stats.mtime,
          Size: stats.size,
        };
      }),
    );
    return { Contents: contents };
  }

  async getObject(key: string): Promise<StorageResponse<Buffer>> {
    const filePath = path.join(this.uploadDirectory, key);
    const data = await fs.promises.readFile(filePath);
    return { Body: data, Key: key, Bucket: this.uploadDirectory };
  }

  async deleteObject(key: string): Promise<StorageResponse<undefined>> {
    const filePath = path.join(this.uploadDirectory, key);
    await fs.promises.unlink(filePath);
    return { Key: key };
  }

  async copyObject(
    sourceKey: string,
    destinationKey: string,
  ): Promise<StorageResponse<CopyObjectResult>> {
    const sourceFilePath = path.join(this.uploadDirectory, sourceKey);
    const destinationFilePath = path.join(this.uploadDirectory, destinationKey);
    await fs.promises.copyFile(sourceFilePath, destinationFilePath);
    return {
      CopyObjectResult: {
        status: 'success',
      },
    };
  }

  async updateObject(
    key: string,
    data: Buffer,
  ): Promise<StorageResponse<{ Key: string; Bucket: string }>> {
    const filePath = path.join(this.uploadDirectory, key);
    await fs.promises.writeFile(filePath, data);
    return { Key: key, Bucket: this.uploadDirectory };
  }

  validateFileSize(req: Request, maxSize: number): boolean {
    const files = (req.files as Express.Multer.File[]) || [];
    return files.every((file) => file.size <= maxSize);
  }

  validateFileType(req: Request, allowedTypes: string[]): boolean {
    const files = (req.files as Express.Multer.File[]) || [];
    const fileExtensions = files.map((file) => path.extname(file.originalname));
    return fileExtensions.every((extension) => allowedTypes.includes(extension.toLowerCase()));
  }

  uploadMiddleware(maxFiles?: number): RequestHandler {
    if (maxFiles) {
      return this.upload.array('files', maxFiles);
    }
    return this.upload.array('files');
  }
}

export default FileStorageService;

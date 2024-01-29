import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: string,
    fileFolder: string,
  ): Promise<CloudinaryResponse> {
    return await v2.uploader.upload(file, {
      folder: `travel/${fileFolder}`,
    });
  }
}

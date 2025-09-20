import { v2 as cloudinary } from "cloudinary";
import {
  IFileStorageService,
  UploadedFile,
} from "../../application/services/IFileStorageService";
import { HttpError } from "../errors/HttpError";

export class CloudinaryStorageService implements IFileStorageService {
  constructor() {console.log(process.env)
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  async upload(
    files: Express.Multer.File[],
    folder?: string
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map((file) => {
      const resource_type = file.mimetype.startsWith("video")
        ? "video"
        : "image";

      return cloudinary.uploader.upload(file.path, {
        resource_type: resource_type,
        folder,
      });
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results.map((result) => ({
        url: result.secure_url,
        mediaType: result.resource_type as "image" | "video",
      }));
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw new HttpError(500, "Failed to upload files to cloud storage.");
    }
  }
}

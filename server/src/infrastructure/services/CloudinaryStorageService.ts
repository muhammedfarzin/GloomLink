import { injectable } from "inversify";
import { v2 as cloudinary } from "cloudinary";
import {
  IFileStorageService,
  UploadedFile,
} from "../../application/services/IFileStorageService";
import { HttpError } from "../errors/HttpError";

@injectable()
export class CloudinaryStorageService implements IFileStorageService {
  constructor() {
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

  async delete(urls: string[], type?: "image"): Promise<void> {
    const getPublicId = (url: string) => {
      const afterUploadIndex = url.indexOf("/upload/") + 8;
      const pathWithVersion = url.substring(afterUploadIndex);
      const pathWithoutVersion = pathWithVersion.substring(
        pathWithVersion.indexOf("/") + 1
      );
      return pathWithoutVersion.split(".")[0];
    };

    const deletePromises = urls.map((url) => {
      const publicId = getPublicId(url);
      return cloudinary.uploader.destroy(
        publicId,
        type && { resource_type: type }
      );
    });

    try {
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Cloudinary deletion failed:", error);
    }
  }
}

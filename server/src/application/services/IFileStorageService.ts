export interface UploadedFile {
  url: string;
  mediaType: "image" | "video";
}

export interface IFileStorageService {
  upload(
    files: Express.Multer.File[],
    folder?: string
  ): Promise<UploadedFile[]>;
  delete(urls: string[], type?: "image"): Promise<void>;
}

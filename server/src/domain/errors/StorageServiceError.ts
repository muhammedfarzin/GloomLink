export class StorageServiceError extends Error {
  constructor(message?: string) {
    super(message || "The file storage service is currently unavailable.");
  }
}

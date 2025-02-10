import { FileUploadDto } from "../types/image.types";

export class ImageUtils {
  static async validateAndProcessImage(file: FileUploadDto) {
    // Validate file type
    if (!file.mimetype.includes("image/")) {
      throw new Error("Invalid file type. Only images are allowed.");
    }

    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }

    return file.buffer;
  }

  static async bufferToBase64(buffer: Buffer): Promise<string> {
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }
}

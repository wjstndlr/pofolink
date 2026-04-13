import imageCompression from "browser-image-compression";

const OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export async function compressImage(file: File): Promise<File> {
  if (file.size <= 1024 * 1024) return file;
  return imageCompression(file, OPTIONS);
}

// utils/upload-image.ts - updated with options parameter
export interface UploadResult {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  productId?: string;
}

export interface DeleteOptions {
  bucket?: string;
}

export async function uploadImages(files: File[], options?: UploadOptions): Promise<UploadResult[]> {
  console.log('uploadImages called with:', { files: files.length, options });
  throw new Error('uploadImages not implemented');
  // Return array untuk kompatibilitas
  return files.map(file => ({
    url: `placeholder-${file.name}`,
    publicId: `id-${file.name}`
  }));
}

export async function deleteImages(publicIds: string[], options?: DeleteOptions): Promise<void> {
  console.log('deleteImages called with:', { publicIds, options });
  throw new Error('deleteImages not implemented');
}

// Keep old names for backward compatibility
export async function uploadImage(file: File, options?: UploadOptions): Promise<UploadResult> {
  const results = await uploadImages([file], options);
  return results[0];
}

export async function deleteImage(publicId: string, options?: DeleteOptions): Promise<void> {
  await deleteImages([publicId], options);
}

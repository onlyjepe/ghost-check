export const MAX_BYTES = 10 * 1024 * 1024;

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateFile(file: File): string | null {
  if (!TYPES.includes(file.type)) {
    return 'That file is not a JPEG, PNG, or WebP image.';
  }
  if (file.size > MAX_BYTES) {
    return 'That file is over 10 MB. Shrink it and try again.';
  }
  return null;
}

export interface LoadedImage {
  url: string;
  width: number;
  height: number;
}

export async function loadImage(file: File): Promise<LoadedImage> {
  const url = URL.createObjectURL(file);
  try {
    const size = await readSize(url);
    return { url, width: size.width, height: size.height };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

function readSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('That image came back empty. Try another file.'));
        return;
      }
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => reject(new Error('That image could not be opened. Try another file.'));
    image.src = url;
  });
}

export async function fileFromUrl(url: string, name: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}

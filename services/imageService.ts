/**
 * Generates a Picsum URL with a random seed to ensure uniqueness on every call.
 * @param width Width of the requested image
 * @param height Height of the requested image
 * @returns string URL
 */
export const generatePicsumUrl = (width: number, height: number): string => {
  // Using a random seed in the URL forces Picsum to return a consistent image for that seed,
  // but changing the seed guarantees a new image without relying on browser cache clearing.
  const randomSeed = Math.floor(Math.random() * 100000);
  return `https://picsum.photos/seed/${randomSeed}/${width}/${height}`;
};

/**
 * Downloads an image from a URL by fetching it as a blob and creating a temporary anchor tag.
 * This bypasses some cross-origin download restrictions on straight <a> tags.
 * @param url The URL of the image to download
 */
export const fetchImageBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.blob();
};
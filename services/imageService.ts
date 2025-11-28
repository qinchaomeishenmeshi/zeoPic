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
export const fetchImageBlob = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    
    // Generate a nice filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `zenpic-${timestamp}.jpg`;
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading the image:', error);
    throw error;
  }
};
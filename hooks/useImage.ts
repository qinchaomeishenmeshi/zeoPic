import { useState, useEffect, useCallback } from 'react';
import { generatePicsumUrl } from '../services/imageService';

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 1600;

export const useImage = (refreshTrigger: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>('');

  const loadImage = useCallback(() => {
    setLoading(true);
    const url = generatePicsumUrl(TARGET_WIDTH, TARGET_HEIGHT);
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageUrl(url);
      setLoading(false);
    };
    img.onerror = () => {
      // In a real app, you might want to set an error state
      // and show a fallback UI.
      console.error("Failed to load image.");
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    loadImage();
  }, [loadImage, refreshTrigger]);

  return { loading, imageUrl, loadImage };
};

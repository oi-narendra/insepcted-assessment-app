import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoMetadata } from '../types/video';
import { STORAGE_KEYS } from '../constants/storage';

export interface UsePersistedVideoReturn {
  video: VideoMetadata | null;
  updateVideo: (metadata: VideoMetadata) => Promise<void>;
  clearVideo: () => Promise<void>;
  isLoading: boolean;
}

export const usePersistedVideo = (): UsePersistedVideoReturn => {
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      try {
        const savedMetadata = await AsyncStorage.getItem(STORAGE_KEYS.VIDEO_METADATA);
        if (savedMetadata) {
          setVideo(JSON.parse(savedMetadata));
        } else {
          setVideo(null); // Ensure video is null if nothing is in storage
        }
      } catch (error) {
        console.error('Error loading persisted video:', error);
        setVideo(null); // Set to null on error
      } finally {
        setIsLoading(false);
      }
    };
    loadVideo();
  }, []);

  const updateVideo = useCallback(async (metadata: VideoMetadata) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_METADATA, JSON.stringify(metadata));
      setVideo(metadata);
    } catch (error) {
      console.error('Error saving video metadata:', error);
      // Optionally, re-throw or handle error state if needed by the component
    }
  }, []);

  const clearVideo = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.VIDEO_METADATA);
      setVideo(null);
    } catch (error) {
      console.error('Error clearing video metadata:', error);
      // Optionally, re-throw or handle error state
    }
  }, []);

  return { video, updateVideo, clearVideo, isLoading };
};

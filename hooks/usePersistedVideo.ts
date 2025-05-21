import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '../types/video';
import { STORAGE_KEYS } from '../constants/storage';

export interface UsePersistedVideoReturn {
  video: Video | null;
  updateVideo: (video: Video) => Promise<void>;
  clearVideo: () => Promise<void>;
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  saveDetails: () => Promise<void>;
  isLoading: boolean;
}

export const usePersistedVideo = (): UsePersistedVideoReturn => {
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      try {
        const savedVideoData = await AsyncStorage.getItem(STORAGE_KEYS.VIDEO_DATA);
        if (savedVideoData) {
          const parsedVideoData = JSON.parse(savedVideoData) as Video;
          setVideo(parsedVideoData);
        } else {
          setVideo(null);
        }
      } catch (error) {
        console.error('Error loading persisted video:', error);
        setVideo(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadVideo();
  }, []);

  const updateVideo = useCallback(async (video: Video) => {
    try {
      // When a new video is picked, its title/description might be empty initially
      // or come from the metadata directly.
      const newTitle = video.metadata?.title !== undefined ? video.metadata?.title : '';
      const newDescription =
        video.metadata?.description !== undefined ? video.metadata?.description : '';
      const fullVideoData = {
        ...video,
        metadata: { ...video.metadata, title: newTitle, description: newDescription },
      };

      await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_DATA, JSON.stringify(fullVideoData));
      setVideo(fullVideoData);
    } catch (error) {
      console.error('Error saving video metadata:', error);
    }
  }, []);

  const updateTitle = useCallback((title: string) => {
    setVideo({ ...video, metadata: { ...video?.metadata, title } });
  }, []);

  const updateDescription = useCallback((description: string) => {
    setVideo({ ...video, metadata: { ...video?.metadata, description } });
  }, []);

  const saveDetails = useCallback(async () => {
    if (!video) return;
    const updatedVideo: Video = {
      ...video,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_DATA, JSON.stringify(updatedVideo));
      setVideo(updatedVideo); // Update the video state as well
    } catch (error) {
      console.error('Error saving video details:', error);
    }
  }, [video]);

  const clearVideo = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.VIDEO_DATA);
      setVideo(null);
    } catch (error) {
      console.error('Error clearing video metadata:', error);
    }
  }, []);

  return {
    video,
    updateVideo,
    clearVideo,
    updateTitle,
    updateDescription,
    saveDetails,
    isLoading,
  };
};

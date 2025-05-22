import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '../types/video';
import { STORAGE_KEYS } from '../constants/storage';
import { useVideoPlayer, VideoPlayer as VideoPlayerType } from 'expo-video';

export interface UsePersistedVideoReturn {
  video: Video | null;
  player: VideoPlayerType;
  loaded: boolean;
  loadVideo: () => Promise<boolean>;
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
  const [loaded, setLoaded] = useState<boolean>(false);

  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.timeUpdateEventInterval = 0.25;
  });

  useEffect(() => {
    const loadInitialVideoFromStorage = async () => {
      setIsLoading(true);
      setLoaded(false);
      player.replaceAsync(null);
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
    loadInitialVideoFromStorage();
  }, [player]);

  const loadVideo = useCallback(async (): Promise<boolean> => {
    if (video && video.uri) {
      try {
        console.log('Attempting to load video into player:', video.uri);
        await player.replaceAsync(video.uri);
        setLoaded(true);
        console.log('Video loaded into player successfully.');
        return true;
      } catch (error) {
        console.error('Error loading video into player:', error);
        setLoaded(false);
        return false;
      }
    } else {
      console.log('No video URI to load into player.');
      setLoaded(false);
      return false;
    }
  }, [video, player]);

  const updateVideo = useCallback(
    async (newVideoData: Video) => {
      try {
        const newTitle =
          newVideoData.metadata?.title !== undefined ? newVideoData.metadata?.title : '';
        const newDescription =
          newVideoData.metadata?.description !== undefined
            ? newVideoData.metadata?.description
            : '';
        const fullVideoData = {
          ...newVideoData,
          metadata: { ...newVideoData.metadata, title: newTitle, description: newDescription },
        };

        await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_DATA, JSON.stringify(fullVideoData));
        setVideo(fullVideoData);
        setLoaded(false);
        await player.replaceAsync(null);
      } catch (error) {
        console.error('Error saving video metadata:', error);
      }
    },
    [player]
  );

  const updateTitle = useCallback((title: string) => {
    setVideo((prevVideo) => {
      if (!prevVideo) return null;
      return { ...prevVideo, metadata: { ...prevVideo.metadata, title } };
    });
  }, []);

  const updateDescription = useCallback((description: string) => {
    setVideo((prevVideo) => {
      if (!prevVideo) return null;
      return { ...prevVideo, metadata: { ...prevVideo.metadata, description } };
    });
  }, []);

  const saveDetails = useCallback(async () => {
    if (!video) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_DATA, JSON.stringify(video));
    } catch (error) {
      console.error('Error saving video details:', error);
    }
  }, [video]);

  const clearVideo = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.VIDEO_DATA);
      setVideo(null);
      setLoaded(false);
      await player.replaceAsync(null);
    } catch (error) {
      console.error('Error clearing video metadata:', error);
    }
  }, [player]);

  return {
    video,
    player,
    loaded,
    loadVideo,
    updateVideo,
    clearVideo,
    updateTitle,
    updateDescription,
    saveDetails,
    isLoading,
  };
};

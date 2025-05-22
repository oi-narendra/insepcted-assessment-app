import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '../types/video';
import { STORAGE_KEYS } from '../constants/storage';
import { useVideoPlayer, VideoPlayer as VideoPlayerType } from 'expo-video';

/**
 * Defines the return type for the `usePersistedVideo` hook.
 *
 **/
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

/**
 * Custom hook `usePersistedVideo` manages the state of the selected video,
 * its persistence to AsyncStorage, and interaction with the `expo-video` player.
 *
 * @returns {UsePersistedVideoReturn} An object containing video state, player instance, and functions to manage them.
 */
export const usePersistedVideo = (): UsePersistedVideoReturn => {
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);

  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    // Load the initial video from AsyncStorage when the hook mounts or player instance changes.
    const loadInitialVideoFromStorage = async () => {
      setIsLoading(true);
      setLoaded(false);
      player.replaceAsync(null);
      try {
        const savedVideoData = await AsyncStorage.getItem(STORAGE_KEYS.VIDEO_DATA);
        if (savedVideoData) {
          setVideo(JSON.parse(savedVideoData) as Video);
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
  }, [player]); // React to player instance changes, though typically stable.

  /**
   * Attempts to load the URI from the current `video` state into the `player`.
   * Updates the `loaded` state based on success or failure.
   * @returns {Promise<boolean>} True if loading was successful, false otherwise.
   */
  const loadVideo = useCallback(async (): Promise<boolean> => {
    if (video?.uri) {
      try {
        await player.replaceAsync(video.uri);
        setLoaded(true);
        return true;
      } catch (error) {
        console.error('Error loading video into player:', error);
        setLoaded(false);
        return false;
      }
    } else {
      setLoaded(false);
      return false;
    }
  }, [video, player]);

  /**
   * Updates the video state with new data, persists it to AsyncStorage,
   * and resets the player by unloading the current video.
   * Ensures title and description are at least empty strings if not provided.
   * @param {Video} newVideoData - The new video object to set and persist.
   */
  const updateVideo = useCallback(
    async (newVideoData: Video) => {
      try {
        // Ensure metadata has title and description, even if empty, for consistent data shape.
        const fullVideoData: Video = {
          ...newVideoData,
          metadata: {
            ...(newVideoData.metadata || {}),
            title: newVideoData.metadata?.title ?? '',
            description: newVideoData.metadata?.description ?? '',
          },
        };

        await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_DATA, JSON.stringify(fullVideoData));
        setVideo(fullVideoData);
        setLoaded(false); // New video is not yet loaded in player
        await player.replaceAsync(null); // Clear player for the new video
      } catch (error) {
        console.error('Error saving video metadata:', error);
      }
    },
    [player]
  );

  /**
   * Updates only the title in the local video state.
   * This change is not persisted to AsyncStorage until `saveDetails` or `updateVideo` is called.
   * @param {string} title - The new title.
   */
  const updateTitle = useCallback((title: string) => {
    setVideo((prevVideo) => {
      if (!prevVideo) return null;
      return { ...prevVideo, metadata: { ...(prevVideo.metadata || {}), title } };
    });
  }, []);

  /**
   * Updates only the description in the local video state.
   * This change is not persisted to AsyncStorage until `saveDetails` or `updateVideo` is called.
   * @param {string} description - The new description.
   */
  const updateDescription = useCallback((description: string) => {
    setVideo((prevVideo) => {
      if (!prevVideo) return null;
      return { ...prevVideo, metadata: { ...(prevVideo.metadata || {}), description } };
    });
  }, []);

  /**
   * Persists the current local `video` state (including any updated title/description)
   * to AsyncStorage.
   */
  const saveDetails = useCallback(async () => {
    if (!video) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_DATA, JSON.stringify(video));
    } catch (error) {
      console.error('Error saving video details:', error);
    }
  }, [video]);

  /**
   * Clears the video from local state and AsyncStorage.
   * Also unloads any video from the player.
   */
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

  // Return all state values and functions for the consuming component
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

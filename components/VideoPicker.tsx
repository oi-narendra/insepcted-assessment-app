import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { formatFileSize, formatDuration } from '../utils/formatters';
import { VideoMetadata } from '../types/video';
import {
  FILE_SIZE_LIMIT_BYTES,
  VIDEO_MAX_DURATION_SECONDS,
  ERROR_MESSAGES,
} from '../constants/video';
import { usePersistedVideo } from '../hooks/usePersistedVideo';

export const VideoPicker: React.FC = () => {
  const { video: persistedVideo, updateVideo, isLoading, clearVideo } = usePersistedVideo();

  const handlePermissionDenied = useCallback(() => {
    Alert.alert('Permission Required', ERROR_MESSAGES.PERMISSION_DENIED, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => {
          Alert.alert('Please open your device settings to grant permissions');
        },
      },
    ]);
  }, []);

  const pickVideo = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        handlePermissionDenied();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: VIDEO_MAX_DURATION_SECONDS,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedVideo = result.assets[0];

        if (selectedVideo.fileSize && selectedVideo.fileSize > FILE_SIZE_LIMIT_BYTES) {
          Alert.alert('File Too Large', ERROR_MESSAGES.FILE_TOO_LARGE);
          return;
        }

        const metadata: VideoMetadata = {
          uri: selectedVideo.uri,
          fileName: selectedVideo.fileName || undefined,
          fileSize: selectedVideo.fileSize || undefined,
          duration: selectedVideo.duration || undefined,
        };

        await updateVideo(metadata);
      }
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', ERROR_MESSAGES.PICKER_ERROR);
    }
  }, [handlePermissionDenied, updateVideo]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-500">Loading video...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4">
      {!persistedVideo ? (
        <TouchableOpacity
          onPress={pickVideo}
          className="rounded-lg bg-blue-500 px-6 py-3"
          accessibilityLabel="Select video button"
          accessibilityHint="Opens the video picker to select a video file">
          <Text className="font-semibold text-white">Select Video</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-full space-y-4">
          <Video
            source={{ uri: persistedVideo.uri }}
            className="h-64 w-full rounded-lg"
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onError={(e) => console.error('Video playback error:', e)}
          />

          <View className="space-y-2">
            {persistedVideo.fileName && (
              <Text className="text-gray-700">File: {persistedVideo.fileName}</Text>
            )}
            <Text className="text-gray-700">Size: {formatFileSize(persistedVideo.fileSize)}</Text>
            <Text className="text-gray-700">
              Duration: {formatDuration(persistedVideo.duration)}
            </Text>
          </View>

          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity
              onPress={pickVideo}
              className="rounded-lg bg-blue-500 px-6 py-3"
              accessibilityLabel="Change video button"
              accessibilityHint="Opens the video picker to select a different video">
              <Text className="font-semibold text-white">Change Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={clearVideo} // Add a button to clear the video
              className="rounded-lg bg-red-500 px-6 py-3"
              accessibilityLabel="Clear video button"
              accessibilityHint="Clears the currently selected video">
              <Text className="font-semibold text-white">Clear Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

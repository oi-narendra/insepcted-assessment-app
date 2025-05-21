import { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { VideoMetadata } from '../../types/video';
import {
  FILE_SIZE_LIMIT_BYTES,
  VIDEO_MAX_DURATION_SECONDS,
  ERROR_MESSAGES,
} from '../../constants/video';
import { usePersistedVideo } from '../../hooks/usePersistedVideo';

export function VideoPicker() {
  const { updateVideo } = usePersistedVideo();

  const handlePermissionDenied = useCallback(() => {
    Alert.alert('Permission Required', ERROR_MESSAGES.PERMISSION_DENIED, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Alert.alert('Please open your device settings to grant permissions'),
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
        mediaTypes: 'videos',
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
          fileName: selectedVideo.fileName || undefined,
          fileSize: selectedVideo.fileSize || undefined,
          duration: selectedVideo.duration || undefined,
          title: '',
          description: '',
        };
        await updateVideo({
          uri: selectedVideo.uri,
          metadata: metadata,
        });
      }
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', ERROR_MESSAGES.PICKER_ERROR);
    }
  }, [handlePermissionDenied, updateVideo]);

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center p-5">
        <TouchableOpacity
          onPress={pickVideo}
          className="flex-row items-center justify-center rounded-lg bg-blue-500 px-5 py-3 shadow-md">
          <Ionicons name="film-outline" size={24} color="white" style={{ marginRight: 8 }} />
          <Text className="text-center text-base font-bold text-white">Select Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

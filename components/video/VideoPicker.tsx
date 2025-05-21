import { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import {
  FILE_SIZE_LIMIT_BYTES,
  VIDEO_MAX_DURATION_SECONDS,
  ERROR_MESSAGES,
} from '@constants/video';

interface VideoPickerProps {
  onVideoSelected: (asset: ImagePicker.ImagePickerAsset) => void;
}

export function VideoPicker({ onVideoSelected }: VideoPickerProps) {
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
        onVideoSelected(selectedVideo);
      }
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', ERROR_MESSAGES.PICKER_ERROR);
    }
  }, [handlePermissionDenied, onVideoSelected]);

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-6">
      <Text className="mb-8 text-center text-3xl font-bold text-white">Select a Video</Text>
      <Text className="mb-10 text-center text-lg text-gray-400">
        Tap the button below to choose a video from your library.
      </Text>

      <TouchableOpacity
        onPress={pickVideo}
        className="flex-row items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 transition-all hover:bg-indigo-700 active:bg-indigo-800">
        <Ionicons name="film-outline" size={28} color="white" style={{ marginRight: 12 }} />
        <Text className="text-center text-xl font-semibold text-white">Choose Video</Text>
      </TouchableOpacity>
    </View>
  );
}

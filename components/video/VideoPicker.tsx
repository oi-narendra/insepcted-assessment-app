import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration, formatFileSize } from '@utils/formatters';

import {
  FILE_SIZE_LIMIT_BYTES,
  VIDEO_MAX_DURATION_SECONDS,
  ERROR_MESSAGES,
} from '@constants/video';

interface VideoPickerProps {
  onVideoReady: (asset: ImagePicker.ImagePickerAsset, title: string, description: string) => void;
  // onCancelPick: () => void; // Decided against this for now to keep it simpler, parent can handle cancel via other means if needed.
}

export function VideoPicker({ onVideoReady }: VideoPickerProps) {
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
    // Clear previous selections and details if any
    setSelectedAsset(null);
    setTitle('');
    setDescription('');
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        handlePermissionDenied();
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        // videoMaxDuration: VIDEO_MAX_DURATION_SECONDS, // videoMaxDuration is not a valid option here, it's for recording. Duration is checked manually.
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const videoAsset = result.assets[0];

        if (videoAsset.duration && videoAsset.duration / 1000 > VIDEO_MAX_DURATION_SECONDS) {
          Alert.alert(
            'Video Too Long',
            `Please select a video shorter than ${VIDEO_MAX_DURATION_SECONDS} seconds.`
          );
          return;
        }

        if (videoAsset.fileSize && videoAsset.fileSize > FILE_SIZE_LIMIT_BYTES) {
          Alert.alert('File Too Large', ERROR_MESSAGES.FILE_TOO_LARGE);
          return;
        }
        setSelectedAsset(videoAsset);
        // We don't call onVideoReady here. User needs to fill details first.
      }
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', ERROR_MESSAGES.PICKER_ERROR);
    }
  }, [handlePermissionDenied]);

  const handleSubmitDetails = () => {
    if (!selectedAsset) {
      Alert.alert('Error', 'No video selected.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your video.');
      return;
    }
    onVideoReady(selectedAsset, title, description);
    // Reset state after submission, effectively taking user out of VideoPicker or to a "success" state managed by parent.
    // For this component, we'll just clear it so it's ready for another pick if the parent decides to show it again.
    setSelectedAsset(null);
    setTitle('');
    setDescription('');
  };

  const handleCancelDetails = () => {
    setSelectedAsset(null);
    setTitle('');
    setDescription('');
    // Potentially call an onCancel prop here if we want parent to know about this explicit cancel.
    // For now, just resets to the initial picker view.
  };

  if (!selectedAsset) {
    // Show the video picker button
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

  // Show the details entry form
  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="p-6">
        <Text className="mb-6 text-center text-3xl font-bold text-white">Add Video Details</Text>

        <View className="mb-6 rounded-lg bg-gray-800 p-4">
          <Text className="mb-1 text-sm text-gray-400">
            File: {selectedAsset.fileName || 'N/A'}
          </Text>
          {selectedAsset.duration !== undefined && selectedAsset.duration !== null && (
            <Text className="mb-1 text-sm text-gray-400">
              Duration: {formatDuration(selectedAsset.duration / 1000)}
            </Text>
          )}
          {selectedAsset.fileSize !== undefined && (
            <Text className="text-sm text-gray-400">
              Size: {formatFileSize(selectedAsset.fileSize)}
            </Text>
          )}
        </View>

        <TextInput
          className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-base text-white placeholder-gray-500"
          placeholder="Video Title"
          placeholderTextColor="#6B7280"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          className="mb-6 w-full rounded-lg border border-gray-700 bg-gray-800 p-4 align-top text-base text-white placeholder-gray-500"
          placeholder="Video Description (Optional)"
          placeholderTextColor="#6B7280"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ height: 100 }}
        />

        <TouchableOpacity
          onPress={handleSubmitDetails}
          className="mb-3 flex-row items-center justify-center rounded-lg bg-green-600 px-6 py-4 shadow-md transition-all hover:bg-green-700 active:bg-green-800">
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text className="text-center text-lg font-semibold text-white">Save and Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancelDetails}
          className="flex-row items-center justify-center rounded-lg bg-gray-600 px-6 py-3 transition-all hover:bg-gray-700 active:bg-gray-800">
          <Ionicons name="arrow-back-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-center text-base font-medium text-white">Cancel & Re-pick</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

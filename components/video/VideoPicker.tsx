import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration, formatFileSize } from '@utils/formatters';

import { FILE_SIZE_LIMIT_BYTES, ERROR_MESSAGES } from '@constants/video';

interface VideoPickerProps {
  onVideoReady: (asset: ImagePicker.ImagePickerAsset, title: string, description: string) => void;
}

export function VideoPicker({ onVideoReady }: VideoPickerProps) {
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const descriptionInputRef = useRef<TextInput>(null);

  const clearErrors = () => {
    setError(null);
    setPermissionError(null);
  };

  const handlePermissionDenied = useCallback(() => {
    clearErrors();
    setPermissionError(
      `${ERROR_MESSAGES.PERMISSION_DENIED} Please open your device settings to grant permissions.`
    );
  }, []);

  const pickVideo = useCallback(async () => {
    clearErrors();
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
        mediaTypes: 'videos',
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const videoAsset = result.assets[0];

        if (videoAsset.fileSize && videoAsset.fileSize > FILE_SIZE_LIMIT_BYTES) {
          setError(ERROR_MESSAGES.FILE_TOO_LARGE);
          return;
        }
        setSelectedAsset(videoAsset);
      }
    } catch (err) {
      console.error('Video picker error:', err);
      setError(ERROR_MESSAGES.PICKER_ERROR);
    }
  }, [handlePermissionDenied]);

  const handleSubmitDetails = () => {
    clearErrors();
    if (!selectedAsset) {
      setError('No video selected. Please pick a video first.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title for your video.');
      return;
    }
    onVideoReady(selectedAsset, title, description);
    setSelectedAsset(null);
    setTitle('');
    setDescription('');
  };

  const handleCancelDetails = () => {
    clearErrors();
    setSelectedAsset(null);
    setTitle('');
    setDescription('');
  };

  if (!selectedAsset) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900 p-6">
        <Text className="mb-8 text-center text-3xl font-bold text-white">Select a Video</Text>
        {permissionError && (
          <View className="mb-4 rounded-md bg-red-500 p-3">
            <Text className="text-center text-white">{permissionError}</Text>
          </View>
        )}
        {error && !permissionError && (
          <View className="mb-4 rounded-md bg-red-500 p-3">
            <Text className="text-center text-white">{error}</Text>
          </View>
        )}
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-gray-900"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={true}>
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
            returnKeyType="next"
            onSubmitEditing={() => descriptionInputRef.current?.focus()}
            blurOnSubmit={false}
          />

          <TextInput
            ref={descriptionInputRef}
            className="mb-6 w-full rounded-lg border border-gray-700 bg-gray-800 p-4 align-top text-base text-white placeholder-gray-500"
            placeholder="Video Description (Optional)"
            placeholderTextColor="#6B7280"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ height: 100 }}
            returnKeyType="done"
          />

          {error && (
            <View className="mb-4 rounded-md bg-red-500 p-3">
              <Text className="text-center text-white">{error}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmitDetails}
            className={`mb-3 flex-row items-center justify-center rounded-lg bg-green-600 px-6 py-4 transition-all hover:bg-green-700 active:bg-green-800 ${Platform.OS === 'ios' ? 'shadow-md' : 'elevation-4'}`}>
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
            <Ionicons
              name="arrow-back-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-center text-base font-medium text-white">Cancel & Re-pick</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

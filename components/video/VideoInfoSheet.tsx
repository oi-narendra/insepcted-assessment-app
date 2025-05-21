import React from 'react';
import { Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { formatFileSize, formatDuration } from '../../utils/formatters';
import { usePersistedVideo } from '../../hooks/usePersistedVideo';

interface VideoInfoSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: string[];
}

export function VideoInfoSheet({ bottomSheetRef, snapPoints }: VideoInfoSheetProps) {
  const { video, updateTitle, updateDescription, saveDetails, clearVideo } = usePersistedVideo();

  const handleSave = async () => {
    await saveDetails();
    Alert.alert('Details Saved', 'Title and description have been saved.');
    bottomSheetRef.current?.close();
  };

  const handleClear = async () => {
    await clearVideo();
  };

  if (!video) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#2C2C2E' }}
      handleIndicatorStyle={{ backgroundColor: '#6B7280' }}>
      <BottomSheetScrollView className="p-5 pb-10">
        <Text className="mb-4 text-center text-xl font-bold text-white">Video Details</Text>
        {video.metadata?.fileName && (
          <Text className="mb-2 text-base text-gray-200">File: {video.metadata?.fileName}</Text>
        )}
        {video.metadata?.fileSize !== undefined && (
          <Text className="mb-2 text-base text-gray-200">
            Size: {formatFileSize(video.metadata?.fileSize)}
          </Text>
        )}
        {video.metadata?.duration !== undefined && (
          <Text className="mb-2 text-base text-gray-200">
            Duration: {formatDuration(video.metadata?.duration)}
          </Text>
        )}
        <TextInput
          placeholder="Enter title"
          value={video.metadata?.title}
          onChangeText={updateTitle}
          className="mb-3 rounded-lg border border-gray-600 bg-gray-700 p-3 text-base text-gray-100 placeholder-gray-400"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          placeholder="Enter description"
          value={video.metadata?.description}
          onChangeText={updateDescription}
          multiline
          numberOfLines={4}
          className="mb-3 h-24 rounded-lg border border-gray-600 bg-gray-700 p-3 align-top text-base text-gray-100 placeholder-gray-400"
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />
        <TouchableOpacity
          onPress={handleSave}
          className="mt-2.5 flex-row items-center justify-center rounded-lg bg-green-600 px-5 py-3 shadow-md hover:bg-green-700">
          <Ionicons name="save-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-center text-base font-bold text-white">Save Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClear}
          className="mt-2.5 flex-row items-center justify-center rounded-lg bg-red-600 px-5 py-3 shadow-md hover:bg-red-700">
          <Ionicons name="trash-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-center text-base font-bold text-white">Clear Video</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

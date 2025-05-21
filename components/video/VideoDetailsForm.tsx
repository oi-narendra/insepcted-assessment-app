import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePersistedVideo } from '@hooks/usePersistedVideo'; // Adjust path as needed

export function VideoDetailsForm() {
  const { video, updateTitle, updateDescription, saveDetails } = usePersistedVideo();

  if (!video || !video.metadata) {
    // This form shouldn't be rendered if there's no video or metadata
    return null;
  }

  const handleSave = async () => {
    await saveDetails();
    Alert.alert('Details Saved', 'Title and description have been saved.');
  };

  return (
    <View className="mt-4 w-full rounded-lg bg-gray-800 p-4">
      <Text className="mb-4 text-xl font-bold text-white">Edit Video Details</Text>
      <TextInput
        placeholder="Enter title"
        value={video.metadata.title || ''}
        onChangeText={updateTitle}
        className="mb-3 rounded-lg border border-gray-700 bg-gray-700 p-3 text-base text-white placeholder-gray-400"
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        placeholder="Enter description"
        value={video.metadata.description || ''}
        onChangeText={updateDescription}
        multiline
        numberOfLines={4}
        className="mb-4 h-24 rounded-lg border border-gray-700 bg-gray-700 p-3 align-top text-base text-white placeholder-gray-400"
        placeholderTextColor="#9CA3AF"
        textAlignVertical="top"
      />
      <TouchableOpacity
        onPress={handleSave}
        className="flex-row items-center justify-center rounded-lg bg-green-600 px-5 py-3 shadow-md hover:bg-green-700 active:bg-green-700">
        <Ionicons name="save-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text className="text-center text-base font-bold text-white">Save Details</Text>
      </TouchableOpacity>
    </View>
  );
}

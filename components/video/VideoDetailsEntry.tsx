import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { formatDuration, formatFileSize } from '@utils/formatters'; // Assuming path alias

interface VideoDetailsEntryProps {
  asset: ImagePicker.ImagePickerAsset;
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void; // To go back to picker
}

export function VideoDetailsEntry({ asset, onSubmit, onCancel }: VideoDetailsEntryProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your video.');
      return;
    }
    onSubmit(title, description);
  };

  return (
    <ScrollView className="flex-1 bg-gray-900" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="p-6">
        <Text className="mb-6 text-center text-3xl font-bold text-white">Add Video Details</Text>

        <View className="mb-6 rounded-lg bg-gray-800 p-4">
          <Text className="mb-1 text-sm text-gray-400">File: {asset.fileName || 'N/A'}</Text>
          {asset.duration !== undefined && asset.duration !== null && (
             <Text className="mb-1 text-sm text-gray-400">Duration: {formatDuration(asset.duration / 1000)}</Text>
          )}
          {asset.fileSize !== undefined && (
            <Text className="text-sm text-gray-400">Size: {formatFileSize(asset.fileSize)}</Text>
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
          style={{ height: 100 }} // Explicit height for multiline TextInput
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="mb-3 flex-row items-center justify-center rounded-lg bg-green-600 px-6 py-4 shadow-md transition-all hover:bg-green-700 active:bg-green-800">
          <Ionicons name="checkmark-circle-outline" size={24} color="white" style={{ marginRight: 10 }} />
          <Text className="text-center text-lg font-semibold text-white">Save and Continue</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onCancel} // Allow user to go back
          className="flex-row items-center justify-center rounded-lg bg-gray-600 px-6 py-3 transition-all hover:bg-gray-700 active:bg-gray-800">
          <Ionicons name="arrow-back-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-center text-base font-medium text-white">Back to Picker</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 
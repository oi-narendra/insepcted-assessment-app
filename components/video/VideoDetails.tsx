import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration, formatFileSize } from '@utils/formatters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from '@dataTypes/video';

interface VideoDetailsProps {
  video: Video;
  onChangeVideo: () => void;
}

/**
 * Displays video metadata (title, filename, duration, size) and a "Change Video" button.
 * This component is typically overlaid on top of the video player.
 */
export function VideoDetails({ video, onChangeVideo }: VideoDetailsProps) {
  // Render nothing if essential video data is missing.
  if (!video || !video.metadata) return null;
  const { title, duration, fileName, fileSize } = video.metadata;

  return (
    <SafeAreaView
      className="absolute left-0 right-0 top-0"
      style={{ backgroundColor: 'transparent' }}>
      <View className="bg-gray-800/70 p-4" pointerEvents="box-none">
        <View className="mb-2 flex-row items-center justify-between">
          {fileName && (
            <Text className="text-xs text-gray-300" numberOfLines={1}>
              {fileName}
            </Text>
          )}
          {duration !== undefined && (
            <Text className="rounded bg-black/30 px-1.5 py-0.5 text-xs text-gray-300">
              {formatDuration(duration)}
            </Text>
          )}
        </View>

        {title && title.trim() !== '' && (
          <Text className="mb-1 text-lg font-bold text-white" numberOfLines={2}>
            {title}
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          {fileSize !== undefined && (
            <Text className="text-xs text-gray-300">{formatFileSize(fileSize)}</Text>
          )}
          <TouchableOpacity
            onPress={onChangeVideo}
            className={`flex-row items-center rounded-md bg-blue-500/80 px-3 py-1.5 hover:bg-blue-600 active:bg-blue-700 ${Platform.OS === 'ios' ? 'shadow-sm' : 'elevation-1'}`}>
            <Ionicons name="refresh-outline" size={16} color="white" style={{ marginRight: 6 }} />
            <Text className="text-sm font-medium text-white">Change Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

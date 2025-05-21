import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration, formatFileSize } from '../../utils/formatters';
import { usePersistedVideo } from '../../hooks/usePersistedVideo';
import { VideoPlayer as VideoPlayerType } from 'expo-video';

interface VideoControlsProps {
  player: VideoPlayerType;
  onChangeVideo: () => void;
}

export function VideoControls({ player, onChangeVideo }: VideoControlsProps) {
  const { video } = usePersistedVideo();

  if (!video || !video.metadata) return null;
  const { title, duration, fileName, fileSize } = video.metadata;

  return (
    <View className="p-4 bg-gray-800/70 absolute bottom-0 left-0 right-0">
      <View className="flex-row justify-between items-center mb-2">
        {fileName && <Text className="text-xs text-gray-300" numberOfLines={1}>{fileName}</Text>}
        {duration !== undefined && (
          <Text className="text-xs text-gray-300 bg-black/30 px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </Text>
        )}
      </View>
      
      {title && title.trim() !== '' && (
        <Text className="text-lg font-bold text-white mb-1" numberOfLines={2}>
          {title}
        </Text>
      )}

      <View className="flex-row justify-between items-center">
        {fileSize !== undefined && (
            <Text className="text-xs text-gray-300">{formatFileSize(fileSize)}</Text>
        )}
        <TouchableOpacity
          onPress={onChangeVideo}
          className="flex-row items-center rounded-md bg-blue-500/80 px-3 py-1.5 shadow-sm hover:bg-blue-600 active:bg-blue-700">
          <Ionicons name="refresh-outline" size={16} color="white" style={{ marginRight: 6 }} />
          <Text className="text-sm font-medium text-white">Change Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

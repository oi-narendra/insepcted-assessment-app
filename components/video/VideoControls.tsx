import { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration } from '../../utils/formatters';
import { usePersistedVideo } from '../../hooks/usePersistedVideo';
import BottomSheet from '@gorhom/bottom-sheet';
import { VideoInfoSheet } from './VideoInfoSheet';

export function VideoControls({ player }: { player: any }) {
  const { video } = usePersistedVideo();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpenBottomSheet = useCallback(() => bottomSheetRef.current?.expand(), []);
  const snapPoints = useMemo(() => ['100%'], []);

  if (!video) return null;

  return (
    <>
      <View
        className={`absolute inset-0 justify-between p-5 ${Platform.OS === 'ios' ? 'pt-12' : 'pt-5'} pointer-events-none`}>
        <View className="pointer-events-auto w-full flex-row items-center justify-between">
          {video.metadata?.duration !== undefined && (
            <Text className="mx-2.5 rounded bg-black/50 px-2 py-1 text-base text-white">
              {formatDuration(video.metadata?.duration)}
            </Text>
          )}
          <TouchableOpacity
            onPress={handleOpenBottomSheet}
            className="rounded-full bg-black/30 p-2">
            <Ionicons name="information-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {video.metadata?.title && video.metadata?.title.trim() !== '' && (
          <View
            className={`absolute left-3.5 right-3.5 rounded-md bg-black/20 p-2.5 ${Platform.OS === 'ios' ? 'bottom-20' : 'bottom-16'}`}>
            <Text className="text-left text-lg font-bold text-white" numberOfLines={2}>
              {video.metadata?.title}
            </Text>
          </View>
        )}
      </View>
      <VideoInfoSheet bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
    </>
  );
}

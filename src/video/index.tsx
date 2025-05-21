import { ActivityIndicator, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { VideoPicker } from '@components/video/VideoPicker';
import { usePersistedVideo } from '@hooks/usePersistedVideo';
import { VideoControls } from '@components/video/VideoControls';
import { useVideoPlayer, VideoPlayer as VideoPlayerType, VideoView } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';
import { VideoDetails } from '@components/video/VideoDetails';

export const VideoPage = () => {
  const { video, isLoading, updateVideo, clearVideo } = usePersistedVideo();

  const player = useVideoPlayer(null, (p: VideoPlayerType) => {
    p.loop = true;
  });

  useEffect(() => {
    if (isLoading) {
      // If loading, ensure player is cleared or doesn't auto-play something stale.
      // This might be redundant if isLoading implies video is also null initially.
      player.replaceAsync(null);
      return;
    }

    if (video) {
      // Persisted video exists, load and play.
      player.replaceAsync(video.uri || null).then(() => {
        // Ensure we only play if a video is still present by the time replaceAsync resolves.
        if (video) {
          player.play();
        }
      });
    } else {
      // No persisted video, ensure player is cleared.
      player.replaceAsync(null);
    }
    // Only re-run when video, isLoading, or the player instance itself changes.
  }, [video, isLoading, player]);

  const handleVideoReady = async (
    asset: ImagePicker.ImagePickerAsset,
    title: string,
    description: string
  ) => {
    const metadata = {
      fileName: asset.fileName || undefined,
      fileSize: asset.fileSize || undefined,
      duration: asset.duration ? asset.duration / 1000 : undefined,
      title,
      description,
    };
    await updateVideo({ uri: asset.uri, metadata });
    // View will change automatically due to `video` state update and re-render
  };

  const handleChangeVideo = () => {
    clearVideo(); // This will set `video` to null, triggering picker view via re-render
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // If not loading, and no video, show picker.
  if (!video) {
    return <VideoPicker onVideoReady={handleVideoReady} />;
  }

  // If not loading and video exists, show player.
  // This check (video && !isLoading) is implicitly true here due to the checks above.
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="aspect-video w-full bg-black">
          <VideoView
            player={player}
            style={{ height: '100%', width: '100%', backgroundColor: 'black' }}
            allowsFullscreen={true}
            nativeControls={false}
          />
        </View>
        <VideoControls player={player} />
        <VideoDetails video={video} onChangeVideo={handleChangeVideo} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoPage;

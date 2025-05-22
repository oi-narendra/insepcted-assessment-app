import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { VideoPicker } from '@components/video/VideoPicker';
import { usePersistedVideo } from '@hooks/usePersistedVideo';
import { VideoView } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { VideoDetails } from '@components/video/VideoDetails';
import { VideoProgressBar } from '@components/video/VideoProgressBar';

export const VideoPage = () => {
  const { video, isLoading, updateVideo, clearVideo, player, loaded, loadVideo } =
    usePersistedVideo();

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
  };

  const handleChangeVideo = () => {
    clearVideo();
  };

  const onPlayPause = useCallback(async () => {
    if (!video || !video.uri) return;

    if (!loaded) {
      const successfullyLoaded = await loadVideo();
      if (successfullyLoaded) {
        if (player) {
          player.play();
        }
      }
    } else {
      if (player && player.playing) {
        player.pause();
      } else if (player) {
        player.play();
      }
    }
  }, [player, loaded, video, loadVideo]);

  const handlePlayFromPlaceholder = useCallback(async () => {
    if (video && video.uri && !loaded) {
      const successfullyLoaded = await loadVideo();
      if (successfullyLoaded && player) {
        player.play();
      }
    }
  }, [video, loaded, loadVideo, player]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!video) {
    return <VideoPicker onVideoReady={handleVideoReady} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="aspect-video w-full bg-black">
          {video && !loaded ? (
            <TouchableOpacity onPress={handlePlayFromPlaceholder} activeOpacity={1}>
              <Image
                source={require('@assets/video_placeholder.png')}
                style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <VideoView
              player={player}
              style={{ height: '100%', width: '100%', backgroundColor: 'black' }}
              allowsFullscreen={true}
              nativeControls={true}
            />
          )}
        </View>
      </ScrollView>
      <VideoDetails video={video} onChangeVideo={handleChangeVideo} />
    </SafeAreaView>
  );
};

export default VideoPage;

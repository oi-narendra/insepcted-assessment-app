import { SafeAreaView } from 'react-native';
import { VideoPicker } from '@components/video/VideoPicker';
import { VideoPlayer } from '@components/video/VideoPlayer';
import { usePersistedVideo } from '@hooks/usePersistedVideo';
import { VideoControls } from '@components/video/VideoControls';
import { useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';

export const VideoPage = () => {
  const { video } = usePersistedVideo();

  useEffect(() => {
    if (video?.uri) {
      player.replace(video.uri);
      player.play();
    }
  }, [video?.uri]);

  const player = useVideoPlayer(video?.uri || null);

  if (!video) return <VideoPicker />;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <VideoControls player={player} />
      <VideoPlayer player={player} />
    </SafeAreaView>
  );
};

export default VideoPage;

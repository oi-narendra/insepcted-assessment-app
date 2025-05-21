import { VideoPlayer as VideoPlayerType, VideoView } from 'expo-video';
import { SafeAreaView } from 'react-native';

export function VideoPlayer({ player }: { player: VideoPlayerType }) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <VideoView
        player={player}
        className="absolute inset-0"
        nativeControls={true}
        contentFit="contain"
        allowsFullscreen={true}
        allowsPictureInPicture={true}
      />
    </SafeAreaView>
  );
}

import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer as VideoPlayerType, VideoPlayerEvents } from 'expo-video';
import { useEffect, useState } from 'react';

interface VideoControlsProps {
  player: VideoPlayerType;
}

export function VideoControls({ player }: VideoControlsProps) {
  // state variable to control the video playback
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    player.addListener('playingChange', (event) => {
      setIsPlaying(event.isPlaying);
    });
  }, [player]);

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <TouchableOpacity
      className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-transparent p-4"
      onPress={togglePlayPause}
      activeOpacity={1} // To make the background transparent on press
    >
      {!isPlaying ? <Ionicons name="play" size={48} color="white" /> : null}
    </TouchableOpacity>
  );
}

export default VideoControls;

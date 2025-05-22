import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer as VideoPlayerType, PlayingChangeEventPayload } from 'expo-video';
import { useEffect, useState } from 'react';

interface VideoControlsProps {
  player: VideoPlayerType | null; // Allow player to be null initially
  onPlayPause?: () => void;
}

export function VideoControls({ player, onPlayPause }: VideoControlsProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!player) {
      setIsPlaying(false);
      return;
    }

    const playingListener = player.addListener(
      'playingChange',
      (event: PlayingChangeEventPayload) => {
        setIsPlaying(event.isPlaying);
      }
    );

    return () => {
      playingListener.remove();
    };
  }, [player]);

  const togglePlayPause = () => {
    if (!player) return; // Don't do anything if player is not available

    if (onPlayPause) {
      onPlayPause();
    } else {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  // Don't render controls if player isn't ready, or perhaps show a loading state
  // For now, just rendering the touchable overlay
  return (
    <TouchableOpacity
      className="absolute bottom-0 left-0 right-0 top-0 flex-1 items-center justify-center bg-transparent p-4"
      onPress={togglePlayPause}
      activeOpacity={1} // To make the background transparent on press
    >
      {player && !isPlaying ? <Ionicons name="play" size={48} color="white" /> : null}
    </TouchableOpacity>
  );
}

export default VideoControls;

import { View, Text } from 'react-native';
import {
  VideoPlayer as VideoPlayerType,
  PlayingChangeEventPayload,
  TimeUpdateEventPayload,
} from 'expo-video';
import { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';

interface VideoProgressBarProps {
  player: VideoPlayerType | null;
}

export function VideoProgressBar({ player }: VideoProgressBarProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    console.log('[VideoProgressBar] Player prop changed or initialised:', player);

    if (!player) {
      setProgress(0);
      return;
    }

    const timeUpdateListener = player.addListener('timeUpdate', (event: TimeUpdateEventPayload) => {
      console.log('[VideoProgressBar] TimeUpdate event:', JSON.stringify(event));

      const currentTime = (event as any).currentTime;
      const duration = (event as any).duration;

      if (typeof currentTime === 'number' && typeof duration === 'number') {
        if (duration > 0) {
          let currentProg = currentTime / duration;
          currentProg = Math.max(0, Math.min(currentProg, 1));
          console.log('[VideoProgressBar] Calculated progress (from timeUpdate):', currentProg);
          setProgress(currentProg);
        } else if (currentTime === 0 && duration === 0) {
          console.log('[VideoProgressBar] Progress reset to 0 (duration 0 from timeUpdate).');
          setProgress(0);
        }
      } else {
        if (player.duration > 0) {
          let currentProg = player.currentTime / player.duration;
          currentProg = Math.max(0, Math.min(currentProg, 1));
          console.log(
            '[VideoProgressBar] Calculated progress (from player object as fallback):',
            currentProg
          );
          setProgress(currentProg);
        } else {
          console.warn(
            '[VideoProgressBar] currentTime or duration not found in TimeUpdate event and player.duration is 0. Event:',
            event
          );
        }
      }
    });

    const playingListener = player.addListener(
      'playingChange',
      (event: PlayingChangeEventPayload) => {
        console.log('[VideoProgressBar] PlayingChange event:', event);
        if (player && !event.isPlaying && player.duration > 0) {
          if (Math.abs(player.currentTime - player.duration) < 0.25) {
            console.log('[VideoProgressBar] Progress set to 1 (video ended).');
            setProgress(1);
          } else if (player.currentTime === 0) {
            console.log('[VideoProgressBar] Progress reset to 0 (currentTime 0 after pause/stop).');
            setProgress(0);
          }
        }
      }
    );

    // Initial progress
    if (player.duration > 0) {
      const initialProgress = Math.max(0, Math.min(player.currentTime / player.duration, 1));
      console.log('[VideoProgressBar] Initial progress set:', initialProgress);
      setProgress(initialProgress);
    } else {
      setProgress(0);
    }

    return () => {
      console.log('[VideoProgressBar] Cleaning up listeners.');
      timeUpdateListener.remove();
      playingListener.remove();
    };
  }, [player]);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}>
      <Progress.Bar
        progress={progress}
        width={null}
        height={2}
        color="white"
        unfilledColor="rgba(255, 255, 255, 0.3)"
        borderColor="transparent"
        borderRadius={0}
        animated={true}
        useNativeDriver={false}
        animationConfig={{ bounciness: 0 }}
        animationType="timing"
      />
    </View>
  );
}

// If you use default exports in your project, you can add:
// export default VideoProgressBar;

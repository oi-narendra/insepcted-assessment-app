import { ActivityIndicator, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { VideoPicker } from '@components/video/VideoPicker';
import { VideoPlayer } from '@components/video/VideoPlayer';
import { usePersistedVideo } from '@hooks/usePersistedVideo';
import { VideoControls } from '@components/video/VideoControls';
import { VideoDetailsEntry } from '@components/video/VideoDetailsEntry';
import { useVideoPlayer, VideoPlayer as VideoPlayerType } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

export const VideoPage = () => {
  const { video, isLoading, updateVideo, clearVideo } = usePersistedVideo();
  const [currentView, setCurrentView] = useState<'picker' | 'details' | 'player'>('picker');
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const player = useVideoPlayer(null, (p: VideoPlayerType) => {
    p.loop = true;
  });

  useEffect(() => {
    if (isLoading) return; // Still loading, an ActivityIndicator will be shown by the main render logic

    if (video) {
      // Persisted video exists
      if (currentView !== 'player') {
        setCurrentView('player'); // Switch to player view if not already there
      }
      // Load and play. This will also cover playing after details are submitted.
      player.replaceAsync(video.uri || null).then(() => {
        // Ensure we only play if the view is indeed player by the time replaceAsync resolves
        if (currentView === 'player' || video) {
          // check video as currentView might be transitioning
          player.play();
        }
      });
    } else {
      // No persisted video
      // If currentView is 'details', it means the user selected a video
      // but hasn't submitted details yet. We should NOT force it to 'picker'.
      // Only switch to 'picker' if there's no video AND we are not in this intermediate step.
      if (currentView !== 'details') {
        setCurrentView('picker');
      }
      player.replaceAsync(null); // Ensure player is cleared if no video
    }
    // Dependencies that reflect external state changes that this effect should react to.
    // currentView was removed from here to prevent resetting the 'details' view.
  }, [video, isLoading, player]);

  const handleVideoSelected = (asset: ImagePicker.ImagePickerAsset) => {
    setSelectedAsset(asset);
    setCurrentView('details');
  };

  const handleCancelDetails = () => {
    setSelectedAsset(null);
    setCurrentView('picker');
  };

  const handleDetailsSubmitted = async (title: string, description: string) => {
    if (selectedAsset) {
      const metadata = {
        fileName: selectedAsset.fileName || undefined,
        fileSize: selectedAsset.fileSize || undefined,
        duration: selectedAsset.duration ? selectedAsset.duration / 1000 : undefined,
        title,
        description,
      };
      await updateVideo({ uri: selectedAsset.uri, metadata });
      setSelectedAsset(null);
      // setCurrentView('player'); // This is now handled by useEffect watching `video`
    } else {
      console.error('No selected asset when submitting details');
      setCurrentView('picker');
    }
  };

  const handleChangeVideo = () => {
    clearVideo(); // This will trigger useEffect to change view to picker
    // setSelectedAsset(null); // Not needed, clearVideo handles state change
    // player.replaceAsync(null); // Handled by useEffect
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (currentView === 'picker') {
    return <VideoPicker onVideoSelected={handleVideoSelected} />;
  }

  if (currentView === 'details' && selectedAsset) {
    return (
      <VideoDetailsEntry
        asset={selectedAsset}
        onSubmit={handleDetailsSubmitted}
        onCancel={handleCancelDetails}
      />
    );
  }

  if (currentView === 'player' && video) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="aspect-video w-full bg-black">
            <VideoPlayer player={player} />
          </View>
          <VideoControls player={player} onChangeVideo={handleChangeVideo} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="mb-4 text-white">Something went wrong or state is inconsistent.</Text>
      <VideoPicker onVideoSelected={handleVideoSelected} />
    </View>
  );
};

export default VideoPage;

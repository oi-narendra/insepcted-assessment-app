import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { VideoPage } from './src/video';
import './global.css'; // Enables NativeWind global styling

// Main application entry point.
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <VideoPage />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

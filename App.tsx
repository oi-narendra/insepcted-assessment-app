import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VideoPicker } from './components/VideoPicker';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <VideoPicker />
    </SafeAreaProvider>
  );
}

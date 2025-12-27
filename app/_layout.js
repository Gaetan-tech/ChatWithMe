import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/contexts/AuthContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { SocketProvider } from '../src/contexts/SocketContext'; // ← Ajoutez
import { ThemeProvider } from '../src/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const { default: notificationService } = await import('../src/services/notificationService');
        await notificationService.registerForPushNotifications();
      } catch (notifError) {
        console.log('Notifications non disponibles:', notifError.message);
      }
      
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error('Erreur initialisation:', error);
      await SplashScreen.hideAsync().catch(() => {});
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SocketProvider>  {/* ← Ajoutez */}
              <StatusBar style="auto" />
              <Slot />
            </SocketProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import 'react-native-reanimated'
import '../global.css'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store/store'
import { PaperProvider } from 'react-native-paper'
import { useEffect } from 'react'
import { Platform, StatusBar } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'
import { PersistGate } from 'redux-persist/integration/react'
import HomeScreen from '@/app/(tabs)'

export default function RootLayout () {

  const colorScheme = useColorScheme()
  useEffect(() => {
    const hideSystemBars = async () => {
      StatusBar.setHidden(true, 'none')

      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync('hidden')
      }
    }

    hideSystemBars()
  }, [])
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)"/>
              <Stack.Screen name="[id]" options={{ presentation: 'modal', title: 'Modal' }}/>
            </Stack>
          </ThemeProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  )
}

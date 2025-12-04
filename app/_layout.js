import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      <Stack screenOptions={{ 
        headerShown: false,
        animationEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              opacity: current.progress,
            },
          };
        }
      }}>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animationEnabled: true,
          }} 
        />
        <Stack.Screen 
          name="details" 
          options={{ 
            headerShown: false,
            animationEnabled: true,
          }} 
        />
      </Stack>
    </>
  );
}
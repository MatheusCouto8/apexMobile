import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={() => ({
        tabBarActiveTintColor: '#60D7E9',
        tabBarInactiveTintColor: '#9CA3AF',
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
          borderBottomColor: 'transparent',
          elevation: 0,
          shadowColor: 'transparent',
          // reserve space for status bar / notch
          paddingTop: insets.top,
          height: 56 + insets.top,
        },
        headerTintColor: '#F3F4F6',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '700',
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(15, 17, 19, 0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(96, 215, 233, 0.15)',
          borderWidth: 0,
          elevation: 8,
          shadowOpacity: 0.15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 8,
          // add safe-area bottom inset so the bar isn't cut on iPhone X/11/12/13/14
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarShowLabel: false,
        animationEnabled: true,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              paddingVertical: 4,
              opacity: focused ? 1 : 0.7,
            }}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Cidades',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              paddingVertical: 4,
              opacity: focused ? 1 : 0.7,
            }}>
              <Ionicons 
                name={focused ? "send" : "send-outline"} 
                size={24} 
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerShown: false,
          title: 'Sobre',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              paddingVertical: 4,
              opacity: focused ? 1 : 0.7,
            }}>
              <Ionicons 
                name={focused ? "information-circle" : "information-circle-outline"} 
                size={24} 
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
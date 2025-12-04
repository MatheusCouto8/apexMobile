import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#60D7E9',
        tabBarInactiveTintColor: '#9CA3AF',
        headerStyle: {
          backgroundColor: '#0F1113',
          borderBottomWidth: 1,
          borderBottomColor: '#1F2937',
          elevation: 0,
          shadowColor: 'transparent',
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
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarShowLabel: false,
        animationEnabled: true,
      }}
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
                size={26} 
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
          title: 'Mensagens',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              paddingVertical: 4,
              opacity: focused ? 1 : 0.7,
            }}>
              <Ionicons 
                name={focused ? "send" : "send-outline"} 
                size={26} 
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
      <Tabs.Screen
        name="about"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
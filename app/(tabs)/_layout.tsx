import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Arcos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="circle.hexagonpath" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rondas"
        options={{
          title: 'Rondas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="target" color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Estadisticas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

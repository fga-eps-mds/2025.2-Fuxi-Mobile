import { NavBar } from '@/components/NavBar';
import { Tabs } from 'expo-router';
import React from 'react';
import colors from "../../theme/colors";

export default function TabsLayout () {
  return (
    <Tabs       screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: "700"},
            }}  tabBar={props => <NavBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="create-project"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="search"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ headerShown: false }}
      />
    </Tabs>
  );
}

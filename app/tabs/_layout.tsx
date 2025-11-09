import { NavBar } from '@/components/NavBar';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout () {
  return (
    <Tabs       screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#003366",
        headerTitleStyle: { fontWeight: "700"},
      }}  tabBar={props => <NavBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: "Favoritos" }}
      />
      <Tabs.Screen
        name="create-research"
        options={{ title: "Criar Projeto" }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Detalhes" }}
      />
    </Tabs>
  );
}

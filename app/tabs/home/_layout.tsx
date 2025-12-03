import colors from '@/theme/colors';
import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{
            headerTitleAlign: "center",
            headerTintColor: colors.primary,
            headerTitleStyle: { fontWeight: "700"},
                }} >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Home' }}
      />

      <Stack.Screen 
        name="project" 
        options={{ title: 'Detalhes' }}
      />

      <Stack.Screen 
      name="author-profile" 
      options={{ title: 'Autor' }} 
      />
      

    </Stack>
  );
}

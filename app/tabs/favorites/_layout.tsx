import colors from '@/theme/colors';
import { Stack } from 'expo-router';

export default function FavoritesStackLayout() {
  return (
    <Stack screenOptions={{
            headerTitleAlign: "center",
            headerTintColor: colors.primary,
            headerTitleStyle: { fontWeight: "700"},
                }} >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Favoritos' }}
      />
      

    </Stack>
  );
}

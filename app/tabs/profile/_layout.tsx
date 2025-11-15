import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
      
      <Stack.Screen 
      name="researcher-projects" 
      options={{ title: 'Meus Projetos' }} 
      />

    </Stack>
  );
}

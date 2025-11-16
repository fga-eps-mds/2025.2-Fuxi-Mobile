import colors from '@/theme/colors';
import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={{
            headerTitleAlign: "center",
            headerTintColor: colors.primary,
            headerTitleStyle: { fontWeight: "700"},
                }} >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Configurações' }}
      />
      
      <Stack.Screen 
      name="researcher-projects" 
      options={{ title: 'Meus Projetos' }} 
      />

      <Stack.Screen 
      name="edit-profile" 
      options={{ title: 'Meu Perfil' }} 
      />
    </Stack>
  );
}

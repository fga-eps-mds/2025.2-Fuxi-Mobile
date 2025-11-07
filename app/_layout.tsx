import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#003366",
        headerTitleStyle: { fontWeight: "700"},
      }} 
      >

      <Stack.Screen name="index"         options={{ title: "", headerBackVisible: false}}/>
      <Stack.Screen
        name="auth/register-type"
        options={{ title: "Seleção de Cadastro" }}
      />

      <Stack.Screen
        name="auth/register-researcher"
        options={{ title: "Cadastro de Pesquisador" }}
      />

      <Stack.Screen
        name="auth/register-company"
        options={{ title: "Cadastro de Empresa" }}
      />

      <Stack.Screen
        name="auth/register-collaborator"
        options={{ title: "Cadastro de Colaborador" }}
      />

      <Stack.Screen
        name="auth/login"
        options={{ title: "Login" }}
      />

      <Stack.Screen
        name="home/index"
        options={{ title: "Início", headerBackVisible: false }}
      />

    </Stack>
    );
}

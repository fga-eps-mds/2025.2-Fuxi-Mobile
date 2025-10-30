import { Alert } from "react-native";

export function validatePassword(password: string): boolean {
  if (!password || password.trim().length === 0) {
    Alert.alert("Senha inválida", "O campo de senha não pode estar vazio.");
    return false;
  }

  if (password.length < 8) {
    Alert.alert("Senha inválida", "A senha deve ter pelo menos 8 caracteres.");
    return false;
  }

  return true;
}

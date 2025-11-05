import { Alert } from "react-native";

export function validateEmail(email: string): boolean {
  if (!email || email.trim().length === 0) {
    Alert.alert("Insira um email válido");
    return false;
  }

  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex === email.length - 1) {
    Alert.alert("Insira um email válido");
    return false;
  }

  return true;
}

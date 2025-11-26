import { Alert } from "react-native";

/**
 * Valida uma date de nascimento no formato DD/MM/AAAA.
 * Retorna true se a date for válida e o usuário tiver 18 anos ou mais.
 * Emite alertas automáticos em caso de erro.
 */
export function validateBirthDate(dateStr: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) {
    Alert.alert("Data inválida.", "Use o formato DD/MM/AAAA.");
    return false;
  }

  const day = parseInt(match[1]);
  const month = parseInt(match[2]) - 1; // monthes começam em 0
  const year = parseInt(match[3]);

  // Construct date in UTC to avoid timezone issues
  const date = new Date(0); // Create a reference date at epoch
  date.setUTCFullYear(year, month, day);
  date.setUTCHours(0, 0, 0, 0);

  // Check if the date is real (e.g., 31/02 is not real)
  // When setting year, month, day, JS automatically corrects invalid dates (e.g., 31 Feb becomes 2 Mar)
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    Alert.alert("Data inválida", "Insira uma data real de nascimento.");
    return false;
  }

  // Check age
  const hoje = new Date(); // This will be the faked system time (e.g., 2025-01-01T00:00:00.000Z)
  // Ensure 'hoje' also represents the start of the day in UTC for consistent comparison
  hoje.setUTCHours(0, 0, 0, 0);
  
  // Future date check
  if (date > hoje) { 
    Alert.alert("Data inválida", "A data de nascimento não pode ser no futuro.");
    return false;
  }

  const date18YearsAgo = new Date();
  date18YearsAgo.setUTCFullYear(hoje.getUTCFullYear() - 18, hoje.getUTCMonth(), hoje.getUTCDate());
  date18YearsAgo.setUTCHours(0, 0, 0, 0);




  if (date > date18YearsAgo) {
    Alert.alert("Idade inválida", "Você precisa ter pelo menos 18 anos.");
    return false;
  }

  return true;
}


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

  // Constrói a data em UTC para evitar problemas de fuso horário
  const date = new Date(0); // Cria uma data de referência na época
  date.setUTCFullYear(year, month, day);
  date.setUTCHours(0, 0, 0, 0);

  // Verifica se a data é real (por exemplo, 31/02 não é real)
  // Ao definir ano, mês, dia, o JS corrige automaticamente datas inválidas (por exemplo, 31 de fevereiro torna-se 2 de março)
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    Alert.alert("Data inválida", "Insira uma data real de nascimento.");
    return false;
  }

  // Verifica a idade
  const hoje = new Date(); // Este será o tempo de sistema simulado (por exemplo, 2025-01-01T00:00:00.000Z)
  // Garante que 'hoje' também represente o início do dia em UTC para comparação consistente
  hoje.setUTCHours(0, 0, 0, 0);
  
  // Verifica data futura
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


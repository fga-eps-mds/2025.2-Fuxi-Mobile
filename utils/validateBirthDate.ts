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

  const date = new Date(year, month, day);

  // verifica se a date é real
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    Alert.alert("data inválida", "Insira uma data real de nascimento.");
    return false;
  }

  // verifica idade
  const hoje = new Date();
  const idade = hoje.getFullYear() - year;
  const jaFezAniversario =
    hoje.getMonth() > month ||
    (hoje.getMonth() === month && hoje.getDate() >= day);

  const idadeFinal = jaFezAniversario ? idade : idade - 1;

  if (idadeFinal < 18) {
    Alert.alert("Idade inválida", "Você precisa ter pelo menos 18 anos.");
    return false;
  }

  return true;
}

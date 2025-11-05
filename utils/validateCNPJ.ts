import { Alert } from "react-native";

export function validateCNPJ(cnpj: string): boolean {
  if (!cnpj) {
    Alert.alert("CNPJ inválido", "O campo CNPJ não pode estar vazio.");
    return false;
  }

  // Remove caracteres não numéricos.
  const cleaned = cnpj.replace(/[^\d]+/g, "");

  if (cleaned.length !== 14) {
    Alert.alert("CNPJ inválido", "O CNPJ deve conter 14 dígitos.");
    return false;
  }

  // Rejeita sequências repetidas (ex: 00000000000000).
  if (/^(\d)\1+$/.test(cleaned)) {
    Alert.alert("CNPJ inválido", "Insira um CNPJ válido.");
    return false;
  }

  // Validação dos dígitos verificadores.
  const calcCheckDigit = (cnpjArray: number[], length: number) => {
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += cnpjArray[length - i] * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result;
  };

  const cnpjArray = cleaned.split("").map(Number);

  const digit1 = calcCheckDigit(cnpjArray, 12);
  if (digit1 !== cnpjArray[12]) {
    Alert.alert("CNPJ inválido", "O CNPJ informado não é válido.");
    return false;
  }

  const digit2 = calcCheckDigit(cnpjArray, 13);
  if (digit2 !== cnpjArray[13]) {
    Alert.alert("CNPJ inválido", "O CNPJ informado não é válido.");
    return false;
  }

  return true;
}
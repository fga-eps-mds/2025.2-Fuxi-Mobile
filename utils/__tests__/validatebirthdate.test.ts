import { validateBirthDate } from "../validateBirthDate";
import { Alert } from "react-native";

jest.mock("react-native", () => ({
  Alert: { alert: jest.fn() },
}));

describe("validateBirthDate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));
  });

  test("retorna false se o formato for inválido", () => {
    const result = validateBirthDate("1/1/2000");
    expect(result).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Data inválida.",
      "Use o formato DD/MM/AAAA."
    );
  });

  test("retorna false se a data não for real", () => {
    const result = validateBirthDate("31/02/2000");
    expect(result).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "data inválida",  
      "Insira uma data real de nascimento."
    );
  });

  test("retorna false se tiver menos de 18 anos", () => {
    const result = validateBirthDate("01/01/2010");
    expect(result).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Idade inválida",
      "Você precisa ter pelo menos 18 anos."
    );
  });

  test("retorna true se tiver 18 anos completos", () => {
    const result = validateBirthDate("01/01/2007");
    expect(result).toBe(true);
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  test("retorna true para adulto válido", () => {
    const result = validateBirthDate("10/05/1990");
    expect(result).toBe(true);
  });
});

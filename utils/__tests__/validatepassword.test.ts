import { validatePassword } from "../validatePassword";
import { Alert } from "react-native";

jest.mock("react-native", () => ({
  Alert: { alert: jest.fn() },
}));

describe("validatePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve retornar false e alertar quando a senha estiver vazia", () => {
    const result = validatePassword("");
    expect(result).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Senha inválida",
      "O campo de senha não pode estar vazio."
    );
  });

  test("deve retornar false e alertar quando a senha tiver menos de 8 caracteres", () => {
    const result = validatePassword("12345");
    expect(result).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Senha inválida",
      "A senha deve ter pelo menos 8 caracteres."
    );
  });

  test("deve retornar true quando a senha for válida", () => {
    const result = validatePassword("senhaSegura123");
    expect(result).toBe(true);
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});

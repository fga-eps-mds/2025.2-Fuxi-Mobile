import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PasswordInputField } from "../PasswordInputField";

describe("PasswordInputField Component", () => {
  it("should render correctly", () => {
    const { getByPlaceholderText } = render(
      <PasswordInputField value="" onChangeText={jest.fn()} />
    );

    const input = getByPlaceholderText("Minimo 8 caracteres");
    expect(input).toBeTruthy();
  });

  it("should toggle password visibility when pressing the eye button", () => {
    const { getByPlaceholderText, getByText } = render(
      <PasswordInputField value="" onChangeText={jest.fn()} />
    );

    const input = getByPlaceholderText("Minimo 8 caracteres");

    // O ícone do olho
    const eyeIcon = getByText(""); // Feather renderiza como texto

    // Primeiro clique — mostrar senha
    fireEvent.press(eyeIcon);
    expect(input.props.secureTextEntry).toBe(false);

    // Segundo clique — esconder senha
    fireEvent.press(eyeIcon);
    expect(input.props.secureTextEntry).toBe(true);
  });

  it("should call onChangeText when typing", () => {
    const mock = jest.fn();

    const { getByPlaceholderText } = render(
      <PasswordInputField value="" onChangeText={mock} />
    );

    const input = getByPlaceholderText("Minimo 8 caracteres");

    fireEvent.changeText(input, "abc123");

    expect(mock).toHaveBeenCalledWith("abc123");
  });
});

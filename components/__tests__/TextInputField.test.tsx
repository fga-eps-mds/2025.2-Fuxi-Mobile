import * as React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TextInputField } from "../TextInputField";

describe("TextInputField", () => {
  it("renderiza o placeholder corretamente", () => {
    const { getByPlaceholderText } = render(
      <TextInputField placeholder="Digite aqui" />
    );

    expect(getByPlaceholderText("Digite aqui")).toBeTruthy();
  });

  it("passa corretamente as props para o TextInput", () => {
    const { getByTestId } = render(
      <TextInputField
        testID="input"
        value="abc"
        editable={false}
      />
    );

    const input = getByTestId("input");

    expect(input.props.value).toBe("abc");
    expect(input.props.editable).toBe(false);
  });

  it("chama onChangeText quando o usuário digita", () => {
    const mockFn = jest.fn();

    const { getByTestId } = render(
      <TextInputField testID="input" onChangeText={mockFn} />
    );

    const input = getByTestId("input");

    fireEvent.changeText(input, "hello");

    expect(mockFn).toHaveBeenCalledWith("hello");
  });

  it("aplica o estilo base corretamente", () => {
    const { getByTestId } = render(
      <TextInputField testID="input" />
    );

    const input = getByTestId("input");

    expect(input.props.style).toEqual(
      expect.objectContaining({
        fontFamily: "Roboto",
        fontSize: 17,
        color: "#1D1D1D",
        paddingHorizontal: 12,
      })
    );
  });
});

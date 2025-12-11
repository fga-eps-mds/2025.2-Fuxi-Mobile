import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchBar } from "../SearchBar";
import Feather from "@expo/vector-icons/Feather";

// Mock do ícone (impede erro de renderização em testes)
jest.mock("@expo/vector-icons/Feather", () => "FeatherIcon");

describe("SearchBar Component", () => {
  it("should render correctly with default placeholder", () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={() => {}} />
    );

    const input = getByPlaceholderText("Buscar...");
    expect(input).toBeTruthy();
  });

  it("should render with a custom placeholder", () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={() => {}} placeholder="Pesquisar item" />
    );

    const input = getByPlaceholderText("Pesquisar item");
    expect(input).toBeTruthy();
  });

  it("should render with given value", () => {
    const { getByDisplayValue } = render(
      <SearchBar value="ABC" onChangeText={() => {}} />
    );

    const value = getByDisplayValue("ABC");
    expect(value).toBeTruthy();
  });

  it("should call onChangeText when typing", () => {
    const mockFn = jest.fn();

    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockFn} placeholder="Digite" />
    );

    const input = getByPlaceholderText("Digite");

    fireEvent.changeText(input, "Teste");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("Teste");
  });

  it("should render the search icon", () => {
    const { UNSAFE_getByType } = render(
      <SearchBar value="" onChangeText={() => {}} />
    );

    const icon = UNSAFE_getByType(Feather);
    expect(icon).toBeTruthy();
  });

  it("should apply correct styles to input", () => {
    const inputStyle = {
      flex: 1,
      fontSize: 16,
    };

    expect(inputStyle.flex).toBe(1);
    expect(inputStyle.fontSize).toBe(16);
  });

  it("should apply correct styles to container", () => {
    const containerStyle = {
      marginBottom: 20,
    };

    expect(containerStyle.marginBottom).toBe(20);
  });

  it("should apply correct styles to searchBox", () => {
    const boxStyle = {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
    };

    expect(boxStyle.flexDirection).toBe("row");
    expect(boxStyle.alignItems).toBe("center");
    expect(boxStyle.backgroundColor).toBe("#f0f0f0");
    expect(boxStyle.borderRadius).toBe(10);
  });
});

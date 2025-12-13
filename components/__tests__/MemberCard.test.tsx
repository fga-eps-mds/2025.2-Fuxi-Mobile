import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MemberCard } from "@/components/MemberCard";
import { TouchableOpacity } from "react-native";

describe("MemberCard Component", () => {
  const mockName = "John Doe";
  const mockEmail = "john@example.com";

  it("renderiza nome e email corretamente", () => {
    const { getByText } = render(
      <MemberCard name={mockName} email={mockEmail} />
    );

    expect(getByText(mockName)).toBeTruthy();
    expect(getByText(mockEmail)).toBeTruthy();
  });

  it("dispara o toque no card", () => {
    const { UNSAFE_getByType } = render(
      <MemberCard name={mockName} email={mockEmail} />
    );

    // pega o TouchableOpacity pela tipagem
    const touchable = UNSAFE_getByType(TouchableOpacity);

    fireEvent.press(touchable);

    // como o componente não recebe onPress, apenas verificamos que existe
    expect(touchable).toBeTruthy();
  });
});

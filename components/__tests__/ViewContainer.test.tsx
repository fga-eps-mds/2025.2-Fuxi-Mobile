import * as React from "react";
import { render } from "@testing-library/react-native";
import { ViewContainer } from "../ViewContainer";
import { Text } from "react-native";

describe("ViewContainer", () => {
  it("renderiza os children corretamente", () => {
    const { getByText } = render(
      <ViewContainer>
        <Text>Olá mundo</Text>
      </ViewContainer>
    );

    expect(getByText("Olá mundo")).toBeTruthy();
  });

  it("passa props extras para o ScrollView (rest props)", () => {
    const { getByTestId } = render(
      <ViewContainer testID="scroll" showsVerticalScrollIndicator={false}>
        <Text>Conteúdo</Text>
      </ViewContainer>
    );

    const scroll = getByTestId("scroll");
    // verifica que a prop foi passada para o ScrollView
    expect(scroll.props.showsVerticalScrollIndicator).toBe(false);
  });

  it("mescla contentContainerStyle com o estilo padrão", () => {
    const { getByTestId } = render(
      <ViewContainer testID="scroll-style" style={{ backgroundColor: "red" }}>
        <Text>Conteúdo</Text>
      </ViewContainer>
    );

    const scroll = getByTestId("scroll-style");
    const contentStyle = scroll.props.contentContainerStyle;

    // contentContainerStyle vem como array [styles.container, styleProp]
    expect(Array.isArray(contentStyle)).toBe(true);

    // garante que o estilo base (backgroundColor: '#ffffff') e o style passado (backgroundColor: 'red') estão presentes
    expect(contentStyle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: "#ffffff" }),
        expect.objectContaining({ backgroundColor: "red" }),
      ])
    );
  });
});

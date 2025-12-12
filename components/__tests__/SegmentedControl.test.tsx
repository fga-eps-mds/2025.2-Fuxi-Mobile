// components/__tests__/SegmentedControl.test.tsx
import * as React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SegmentedControl from "../SegmentedControl";

describe("SegmentedControl Component", () => {
  const options = ["Option 1", "Option 2", "Option 3"];
  const selectedOption = "Option 2";
  const onSelectMock = jest.fn();

  it("renders all options", () => {
    const { getByText } = render(
      <SegmentedControl
        options={options}
        selected={selectedOption}
        onSelect={onSelectMock}
      />
    );

    options.forEach(option => {
      expect(getByText(option)).toBeDefined();
    });
  });

  it("applies selected styles to the selected option", () => {
    const { getByText } = render(
      <SegmentedControl
        options={options}
        selected={selectedOption}
        onSelect={onSelectMock}
      />
    );

    const selectedText = getByText(selectedOption);
    // Testa se a cor do texto selecionado é a esperada
    expect(selectedText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: "#003A7A" })
      ])
    );
  });

  it("calls onSelect when an option is pressed", () => {
    const { getByText } = render(
      <SegmentedControl
        options={options}
        selected={selectedOption}
        onSelect={onSelectMock}
      />
    );

    const optionToPress = getByText("Option 1");
    fireEvent.press(optionToPress);

    expect(onSelectMock).toHaveBeenCalledWith("Option 1");
  });
});

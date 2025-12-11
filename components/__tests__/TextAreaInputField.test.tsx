import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextAreaInputField } from '../TextAreaInputField';

describe('TextAreaInputField Component', () => {
  it('should render placeholder correctly', () => {
    const { getByPlaceholderText } = render(
      <TextAreaInputField placeholder="Digite aqui" />
    );

    const input = getByPlaceholderText('Digite aqui');
    expect(input).toBeDefined();
  });

  it('should allow typing text', () => {
    const mockOnChange = jest.fn();

    const { getByPlaceholderText } = render(
      <TextAreaInputField placeholder="Digite" onChangeText={mockOnChange} />
    );

    const input = getByPlaceholderText('Digite');
    fireEvent.changeText(input, 'Texto inserido');

    expect(mockOnChange).toHaveBeenCalledWith('Texto inserido');
  });

  it('should render as multiline', () => {
    const { getByPlaceholderText } = render(
      <TextAreaInputField placeholder="Multiline" />
    );

    const input = getByPlaceholderText('Multiline');

    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(5);
    expect(input.props.textAlignVertical).toBe('top');
  });

  it('should apply custom props', () => {
    const { getByPlaceholderText } = render(
      <TextAreaInputField
        placeholder="Props"
        editable={false}
        maxLength={200}
      />
    );

    const input = getByPlaceholderText('Props');

    expect(input.props.editable).toBe(false);
    expect(input.props.maxLength).toBe(200);
  });

  it('should apply custom styles when passed', () => {
    const { getByPlaceholderText } = render(
      <TextAreaInputField
        placeholder="Estilizado"
        style={{ backgroundColor: 'red' }}
      />
    );

    const input = getByPlaceholderText('Estilizado');

    expect(input.props.style).toEqual(
      expect.objectContaining({ backgroundColor: 'red' })
    );
  });
});

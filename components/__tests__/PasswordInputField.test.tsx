import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PasswordInputField } from '../PasswordInputField';

// Mock do Feather icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

describe('PasswordInputField Component', () => {
  // Testa se o componente renderiza com placeholder padrão
  it('should render with default placeholder', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <PasswordInputField
        value=""
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Minimo 8 caracteres');
    expect(input).toBeDefined();
  });

  // Testa se o componente renderiza com placeholder customizado
  it('should render with custom placeholder', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <PasswordInputField
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Digite sua senha"
      />
    );

    const input = getByPlaceholderText('Digite sua senha');
    expect(input).toBeDefined();
  });

  // Testa se a função onChangeText é chamada ao digitar
  it('should call onChangeText when typing', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <PasswordInputField
        value=""
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Minimo 8 caracteres');
    fireEvent.changeText(input, 'minhasenha123');

    expect(mockOnChangeText).toHaveBeenCalledWith('minhasenha123');
  });

  // Testa se o componente exibe o valor corretamente
  it('should display the value correctly', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <PasswordInputField
        value="senha123"
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByDisplayValue('senha123');
    expect(input).toBeDefined();
  });

  // Testa se o componente renderiza corretamente
  it('should render the component correctly', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <PasswordInputField
        value="teste"
        onChangeText={mockOnChangeText}
      />
    );

    expect(getByPlaceholderText('Minimo 8 caracteres')).toBeDefined();
  });

  // Testa se o botão de visibilidade alterna a exibição da senha
  it('should toggle password visibility when eye button is pressed', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <PasswordInputField
        value="senha123"
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Minimo 8 caracteres');
    
    // Inicialmente a senha deve estar oculta (secureTextEntry = true)
    expect(input.props.secureTextEntry).toBe(true);

    // Encontra o botão do olho e clica
    const eyeButton = getByTestId('password-visibility-toggle');
    fireEvent.press(eyeButton);

    // Após clicar, a senha deve estar visível (secureTextEntry = false)
    expect(input.props.secureTextEntry).toBe(false);

    // Clica novamente para ocultar
    fireEvent.press(eyeButton);

    // Senha deve estar oculta novamente
    expect(input.props.secureTextEntry).toBe(true);
  });
});
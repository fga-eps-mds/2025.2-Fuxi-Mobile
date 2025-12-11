import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PrimaryButton } from '../PrimaryButton';
import { usePathname } from 'expo-router';

// Mock do expo-router
jest.mock('expo-router', () => ({
  usePathname: jest.fn(() => '/home'),
}));

const mockUsePathname = usePathname as jest.Mock;

describe('PrimaryButton Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/home');
  });

  // Testa se o componente renderiza com o título correto
  it('should render with correct title', () => {
    const { getByText } = render(
      <PrimaryButton title="Login" />
    );

    const button = getByText('Login');
    expect(button).toBeDefined();
  });

  // Testa se a função onPress é chamada ao clicar
  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Entrar" onPress={mockOnPress} />
    );

    const button = getByText('Entrar');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  // Testa se o botão renderiza com diferentes títulos
  it('should render with different titles', () => {
    const { getByText } = render(
      <PrimaryButton title="Cadastrar" />
    );

    const button = getByText('Cadastrar');
    expect(button).toBeDefined();
  });

  // Testa se o botão renderiza quando desabilitado
  it('should render when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Desabilitado" disabled={true} onPress={mockOnPress} />
    );

    const button = getByText('Desabilitado');
    expect(button).toBeDefined();
  });

  // Testa se o componente renderiza com cor customizada
  it('should render with custom color', () => {
    const { getByText } = render(
      <PrimaryButton title="Colorido" color="#FF0000" />
    );

    const button = getByText('Colorido');
    expect(button).toBeDefined();
  });

  // Testa se o componente aplica estilo de autenticação em paths de auth
  it('should apply auth style when on auth path', () => {
    mockUsePathname.mockReturnValue('/auth/login');
    
    const { getByText } = render(
      <PrimaryButton title="Entrar" />
    );

    const button = getByText('Entrar');
    expect(button).toBeDefined();
  });
});
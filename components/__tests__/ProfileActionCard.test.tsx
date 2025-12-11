import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfileActionCard } from '../ProfileActionCard';

// Mock do Feather icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

describe('ProfileActionCard Component', () => {
  // Testa se o componente renderiza com título
  it('should render with title', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ProfileActionCard
        title="Configurações"
        onPress={mockOnPress}
      />
    );

    const title = getByText('Configurações');
    expect(title).toBeDefined();
  });

  // Testa se o componente renderiza com título e descrição
  it('should render with title and description', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ProfileActionCard
        title="Editar Perfil"
        description="Altere suas informações pessoais"
        onPress={mockOnPress}
      />
    );

    const title = getByText('Editar Perfil');
    const description = getByText('Altere suas informações pessoais');
    
    expect(title).toBeDefined();
    expect(description).toBeDefined();
  });

  // Testa se a função onPress é chamada ao clicar
  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ProfileActionCard
        title="Sair"
        onPress={mockOnPress}
      />
    );

    const card = getByText('Sair');
    fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  // Testa se o componente renderiza sem descrição
  it('should render without description', () => {
    const mockOnPress = jest.fn();
    const { getByText, queryByText } = render(
      <ProfileActionCard
        title="Ajuda"
        onPress={mockOnPress}
      />
    );

    const title = getByText('Ajuda');
    expect(title).toBeDefined();
    
    // Não deve ter descrição
    const description = queryByText('Descrição');
    expect(description).toBeNull();
  });

  // Testa se o componente renderiza com diferentes títulos
  it('should render with different titles', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ProfileActionCard
        title="Termos de Uso"
        onPress={mockOnPress}
      />
    );

    const title = getByText('Termos de Uso');
    expect(title).toBeDefined();
  });
});

import * as React from 'react';
import { render } from '@testing-library/react-native';
import { InputContainer } from '../InputContainer';
import { Text, TextInput } from 'react-native';

describe('InputContainer Component', () => {
  // Testa se o componente renderiza com label
  it('should render with label', () => {
    const { getByText } = render(
      <InputContainer label="Nome do Campo">
        <TextInput placeholder="Digite aqui" />
      </InputContainer>
    );

    const label = getByText('Nome do Campo');
    expect(label).toBeDefined();
  });

  // Testa se o componente renderiza sem label
  it('should render without label', () => {
    const { getByPlaceholderText, queryByText } = render(
      <InputContainer>
        <TextInput placeholder="Digite aqui" />
      </InputContainer>
    );

    const input = getByPlaceholderText('Digite aqui');
    expect(input).toBeDefined();
    
    // Não deve ter label
    const label = queryByText('Nome do Campo');
    expect(label).toBeNull();
  });

  // Testa se o componente renderiza o children corretamente
  it('should render children correctly', () => {
    const { getByText } = render(
      <InputContainer label="Campo">
        <Text>Conteúdo filho</Text>
      </InputContainer>
    );

    const children = getByText('Conteúdo filho');
    expect(children).toBeDefined();
  });

  // Testa se o componente renderiza com diferentes labels
  it('should render with different labels', () => {
    const { getByText } = render(
      <InputContainer label="Email">
        <TextInput placeholder="email@exemplo.com" />
      </InputContainer>
    );

    const label = getByText('Email');
    expect(label).toBeDefined();
  });

  // Testa se o componente renderiza múltiplos children
  it('should render multiple children', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputContainer label="Dados">
        <Text>Texto auxiliar</Text>
        <TextInput placeholder="Campo de entrada" />
      </InputContainer>
    );

    const textoAuxiliar = getByText('Texto auxiliar');
    const input = getByPlaceholderText('Campo de entrada');
    
    expect(textoAuxiliar).toBeDefined();
    expect(input).toBeDefined();
  });
});
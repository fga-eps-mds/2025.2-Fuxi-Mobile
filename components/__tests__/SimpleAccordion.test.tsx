import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SimpleAccordion } from '../SimpleAccordion';
import { Text } from 'react-native';

describe('SimpleAccordion Component', () => {
  // Testa se o título é renderizado
  it('should render the title', () => {
    const { getByText } = render(
      <SimpleAccordion title="Informações">
        Conteúdo do accordion
      </SimpleAccordion>
    );

    const title = getByText('Informações');
    expect(title).toBeDefined();
  });

  // Testa se o conteúdo NÃO aparece inicialmente
  it('should not render content initially', () => {
    const { queryByText } = render(
      <SimpleAccordion title="Título teste">
        Conteúdo oculto
      </SimpleAccordion>
    );

    const content = queryByText('Conteúdo oculto');
    expect(content).toBeNull();
  });

  // Testa se exibe conteúdo ao clicar
  it('should show content when pressed', () => {
    const { getByText } = render(
      <SimpleAccordion title="Abrir">
        Texto interno
      </SimpleAccordion>
    );

    const header = getByText('Abrir');
    fireEvent.press(header);

    const content = getByText('Texto interno');
    expect(content).toBeDefined();
  });

  // Testa se oculta conteúdo ao clicar duas vezes
  it('should hide content when pressed again', () => {
    const { getByText, queryByText } = render(
      <SimpleAccordion title="Teste">
        Algo aqui
      </SimpleAccordion>
    );

    const header = getByText('Teste');

    fireEvent.press(header); // abre
    expect(getByText('Algo aqui')).toBeDefined();

    fireEvent.press(header); // fecha
    expect(queryByText('Algo aqui')).toBeNull();
  });

  // Testa se o componente renderiza children corretamente
  it('should render children correctly', () => {
    const { getByText } = render(
      <SimpleAccordion title="Detalhes">
        Mensagem interna
      </SimpleAccordion>
    );

    const header = getByText('Detalhes');
    fireEvent.press(header);

    const child = getByText('Mensagem interna');
    expect(child).toBeDefined();
  });
});

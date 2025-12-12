import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DropdownSelect } from '../DropdownSelect';

describe('DropdownSelect Component', () => {
  // Mock de opções para testes
  const mockOptions = [
    { label: 'Opção 1', value: 'opcao1' },
    { label: 'Opção 2', value: 'opcao2' },
    { label: 'Opção 3', value: 'opcao3' }
  ];

  // Testa se o componente renderiza com placeholder padrão
  it('should render with default placeholder', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownSelect
        options={mockOptions}
        value={null}
        onSelect={mockOnSelect}
      />
    );

    const placeholder = getByText('Selecione uma opção');
    expect(placeholder).toBeDefined();
  });

  // Testa se o componente renderiza com placeholder customizado
  it('should render with custom placeholder', () => {
    const mockOnSelect = jest.fn();
    const customPlaceholder = 'Escolha uma opção';
    const { getByText } = render(
      <DropdownSelect
        options={mockOptions}
        value={null}
        onSelect={mockOnSelect}
        placeholder={customPlaceholder}
      />
    );

    const placeholder = getByText(customPlaceholder);
    expect(placeholder).toBeDefined();
  });

  // Testa se o componente exibe o valor selecionado
  it('should display selected value', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownSelect
        options={mockOptions}
        value="opcao1"
        onSelect={mockOnSelect}
      />
    );

    const selectedText = getByText('Opção 1');
    expect(selectedText).toBeDefined();
  });

  // Testa se o componente renderiza com lista de opções vazia
  it('should render with empty options list', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownSelect
        options={[]}
        value={null}
        onSelect={mockOnSelect}
        placeholder="Sem opções"
      />
    );

    const placeholder = getByText('Sem opções');
    expect(placeholder).toBeDefined();
  });

  // Testa se onSelect é chamado quando um item é selecionado
  it('should call onSelect when an item is selected', () => {
    const mockOnSelect = jest.fn();
    const { UNSAFE_getByType } = render(
      <DropdownSelect
        options={mockOptions}
        value={null}
        onSelect={mockOnSelect}
      />
    );

    // Importa o Dropdown para acessar via UNSAFE_getByType
    const Dropdown = require('react-native-element-dropdown').Dropdown;
    const dropdown = UNSAFE_getByType(Dropdown);
    
    // Simula a mudança de valor chamando onChange diretamente
    dropdown.props.onChange({ label: 'Opção 2', value: 'opcao2' });

    expect(mockOnSelect).toHaveBeenCalledWith('opcao2');
  });
});
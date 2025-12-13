// components/__tests__/DemandCard.test.tsx
import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DemandCard } from '../DemandCard';
import { getUsers } from '@/services/userService';
import Feather from '@expo/vector-icons/Feather';

// Mock dos usuários
jest.mock('@/services/userService', () => ({
  getUsers: jest.fn()
}));

// JSON de demanda de exemplo
const mockDemand = {
  id: 1,
  company: 1,
  createdDate: "2025-12-10",
  title: "MINHA DEMANDA",
  description: "DESCRIÇÃO DA PESQUISA",
  knowledge_area: "CIENCIA"
};

// JSON de usuários de exemplo
const mockUsers = [
  {
    id: 1,
    email: "pesquisador@unb.br",
    user_type: "researcher",
    researcher_profile: { id: 1, firstName: "Pesquisador", surname: "da Silva", birthDate: "2000-01-01", campus: "FCTE" },
    collaborator_profile: null,
    company_profile: null
  },
  {
    id: 2,
    email: "empresa@unb.br",
    user_type: "company",
    researcher_profile: null,
    collaborator_profile: null,
    company_profile: { id: 1, fantasyName: "Empresa", cnpj: "27.000.511/0001-60", size: "MEI" }
  },
  {
    id: 3,
    email: "colaborador@unb.br",
    user_type: "collaborator",
    researcher_profile: null,
    collaborator_profile: { id: 2, firstName: "Colaborador", surname: "da Silva", birthDate: "2000-01-01", category: "EXTERNO" },
    company_profile: null
  }
];

describe('DemandCard Component', () => {
  beforeEach(() => {
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('renders title, description and company name', async () => {
    const { getByText } = render(<DemandCard demand={mockDemand} />);

    expect(getByText(mockDemand.title)).toBeDefined();
    expect(getByText(mockDemand.description)).toBeDefined();

    await waitFor(() => {
      expect(getByText('Empresa: Empresa')).toBeDefined();
    });
  });

  it('calls onPress when card is pressed', async () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<DemandCard demand={mockDemand} onPress={onPressMock} />);

    await waitFor(() => {
      fireEvent.press(getByText(mockDemand.title));
      expect(onPressMock).toHaveBeenCalledWith(mockDemand.id);
    });
  });

  it('renders actions and triggers onEdit/onDelete', async () => {
    const onEditMock = jest.fn();
    const onDeleteMock = jest.fn();

    // Adicionamos testID para capturar botões
    const { getAllByTestId } = render(
      <DemandCard
        demand={mockDemand}
        showActions={true}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    // Usaremos querySelector-like pelo testID
    const editButton = getAllByTestId('edit-button')[0];
    const deleteButton = getAllByTestId('delete-button')[0];

    fireEvent.press(editButton);
    fireEvent.press(deleteButton);

    expect(onEditMock).toHaveBeenCalledWith(mockDemand.id);
    expect(onDeleteMock).toHaveBeenCalledWith(mockDemand.id);
  });

  it('renders chevron when showActions is false', async () => {
    const { getByTestId } = render(
      <DemandCard demand={mockDemand} onPress={() => {}} />
    );

    const chevronIcon = getByTestId('chevron-icon');
    expect(chevronIcon).toBeDefined();
  });

  it('shows "Empresa: " when company name is not found', async () => {
    const emptyCompanyDemand = { ...mockDemand, company: 999 }; // ID de empresa inexistente
    const { getByText } = render(<DemandCard demand={emptyCompanyDemand} />);

    await waitFor(() => {
      expect(getByText('Empresa: ')).toBeDefined();
    });
  });
});

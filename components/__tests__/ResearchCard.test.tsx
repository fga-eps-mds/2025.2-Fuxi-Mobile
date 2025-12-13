// components/__tests__/ResearchCard.test.tsx
import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ResearchCard } from '../ResearchCard';
import { getUsers } from '@/services/userService';
import { TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

// Mock dos usuários
jest.mock('@/services/userService', () => ({
  getUsers: jest.fn()
}));

// JSON de pesquisa de exemplo
const mockResearch = {
  id: 1,
  researcher: 1,
  sponsoring_company: 1,
  createdDate: "2025-12-10",
  title: "MINHA PESQUISA 3",
  description: "DESCRIÇÃO DA PESQUISA",
  status: "APROVADO",
  knowledge_area: "CIENCIA",
  keywords: ["PALAVRA1","PALAVRA2","PALAVRA3"],
  members: ["1"],
  campus: "FCTE"
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

describe('ResearchCard Component', () => {
  beforeEach(() => {
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('renders title, description and member names', async () => {
    const { getByText } = render(<ResearchCard research={mockResearch} />);

    expect(getByText(mockResearch.title)).toBeDefined();
    expect(getByText(mockResearch.description)).toBeDefined();

    await waitFor(() => {
      expect(getByText('Membro: Pesquisador da Silva')).toBeDefined();
    });
  });

  it('calls onPress when card is pressed', async () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<ResearchCard research={mockResearch} onPress={onPressMock} />);

    await waitFor(() => {
      fireEvent.press(getByText(mockResearch.title));
      expect(onPressMock).toHaveBeenCalledWith(mockResearch.id);
    });
  });

  it('renders actions and triggers onEdit/onDelete', async () => {
    const onEditMock = jest.fn();
    const onDeleteMock = jest.fn();

    const { getAllByTestId } = render(
      <ResearchCard
        research={mockResearch}
        showActions={true}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const editButton = getAllByTestId('edit-button')[0];
    const deleteButton = getAllByTestId('delete-button')[0];

    fireEvent.press(editButton);
    fireEvent.press(deleteButton);

    expect(onEditMock).toHaveBeenCalledWith(mockResearch.id);
    expect(onDeleteMock).toHaveBeenCalledWith(mockResearch.id);
  });

  it('renders chevron when showActions is false', async () => {
    const { getByTestId } = render(
      <ResearchCard research={mockResearch} onPress={() => {}} />
    );

    const chevronIcon = getByTestId('chevron-icon');
    expect(chevronIcon).toBeDefined();
  });

  it('shows "Nenhum membro" when members array is empty', async () => {
    const emptyResearch = { ...mockResearch, members: [] };
    const { getByText } = render(<ResearchCard research={emptyResearch} />);

    await waitFor(() => {
      expect(getByText('Nenhum membro')).toBeDefined();
    });
  });

  it('handles multiple members and users without profile', async () => {
    const multiMembersResearch = {
      ...mockResearch,
      members: ["1", "2", "3", "999"] // 999 não existe no mockUsers
    };

    const { getByText } = render(<ResearchCard research={multiMembersResearch} />);

    await waitFor(() => {
      expect(getByText('Membros: Pesquisador da Silva, Empresa, ...')).toBeDefined();
    });
  });
});

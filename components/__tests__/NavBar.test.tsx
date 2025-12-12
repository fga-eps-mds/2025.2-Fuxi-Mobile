import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavBar } from '../NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('researcher')),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock do Feather icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

describe('NavBar Component', () => {
  // Mock das props do BottomTabBarProps
  const createMockProps = (activeIndex = 0) => ({
    state: {
      index: activeIndex,
      routes: [
        { key: 'home-key', name: 'home', params: undefined },
        { key: 'search-key', name: 'search', params: undefined },
        { key: 'profile-key', name: 'profile', params: undefined },
      ],
      routeNames: ['home', 'search', 'profile'],
      history: [],
      type: 'tab' as const,
      stale: false,
    },
    descriptors: {
      'home-key': {
        options: { href: '/home', tabBarAccessibilityLabel: 'Home', tabBarButtonTestID: 'home-tab' },
        route: { key: 'home-key', name: 'home', params: undefined },
        navigation: {} as any,
        render: () => null,
      },
      'search-key': {
        options: { href: '/search', tabBarAccessibilityLabel: 'Search', tabBarButtonTestID: 'search-tab' },
        route: { key: 'search-key', name: 'search', params: undefined },
        navigation: {} as any,
        render: () => null,
      },
      'profile-key': {
        options: { href: '/profile', tabBarAccessibilityLabel: 'Profile', tabBarButtonTestID: 'profile-tab' },
        route: { key: 'profile-key', name: 'profile', params: undefined },
        navigation: {} as any,
        render: () => null,
      },
    },
    navigation: {
      navigate: jest.fn(),
      emit: jest.fn(() => ({ defaultPrevented: false })),
    },
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  // Testa se o componente renderiza corretamente
  it('should render the NavBar component', async () => {
    const mockProps = createMockProps();
    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      const homeTab = getByTestId('home-tab');
      expect(homeTab).toBeDefined();
    });
  });

  // Testa se renderiza múltiplas tabs
  it('should render multiple tabs', async () => {
    const mockProps = createMockProps();
    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      const homeTab = getByTestId('home-tab');
      const searchTab = getByTestId('search-tab');
      const profileTab = getByTestId('profile-tab');

      expect(homeTab).toBeDefined();
      expect(searchTab).toBeDefined();
      expect(profileTab).toBeDefined();
    });
  });

  // Testa se a função onPress é chamada ao clicar em uma tab
  it('should call navigation.emit and navigate on tab press', async () => {
    const mockProps = createMockProps();
    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      const searchTab = getByTestId('search-tab');
      fireEvent.press(searchTab);
    });

    expect(mockProps.navigation.emit).toHaveBeenCalled();
  });

  // Testa se a tab ativa não navega novamente
  it('should not navigate when pressing the active tab', async () => {
    const mockProps = createMockProps(0); // home é a tab ativa (index 0)
    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      const homeTab = getByTestId('home-tab');
      fireEvent.press(homeTab);
    });

    // navigate não deve ser chamado pois já está na tab ativa
    expect(mockProps.navigation.navigate).not.toHaveBeenCalled();
  });

  // Testa se o componente renderiza com accessibilityRole
  it('should render tabs with correct accessibility role', async () => {
    const mockProps = createMockProps();
    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      const homeTab = getByTestId('home-tab');
      expect(homeTab.props.accessibilityRole).toBe('button');
    });
  });

  // Testa onLongPress
  it('should call navigation.emit on long press', async () => {
    const mockProps = createMockProps();
    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      const homeTab = getByTestId('home-tab');
      fireEvent(homeTab, 'longPress');
    });

    expect(mockProps.navigation.emit).toHaveBeenCalledWith({
      type: 'tabLongPress',
      target: 'home-key',
    });
  });

  // Testa quando userType é 'company' (esconde create-project)
  it('should hide create-project tab for company user', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('company');
    
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'home-key', name: 'home', params: undefined },
          { key: 'create-project-key', name: 'create-project', params: undefined },
          { key: 'profile-key', name: 'profile', params: undefined },
        ],
        routeNames: ['home', 'create-project', 'profile'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'home-key': {
          options: { href: '/home', tabBarAccessibilityLabel: 'Home', tabBarButtonTestID: 'home-tab' },
          route: { key: 'home-key', name: 'home', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'create-project-key': {
          options: { href: '/create-project', tabBarAccessibilityLabel: 'Create Project', tabBarButtonTestID: 'create-project-tab' },
          route: { key: 'create-project-key', name: 'create-project', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'profile-key': {
          options: { href: '/profile', tabBarAccessibilityLabel: 'Profile', tabBarButtonTestID: 'profile-tab' },
          route: { key: 'profile-key', name: 'profile', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { queryByTestId, getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('home-tab')).toBeDefined();
      expect(queryByTestId('create-project-tab')).toBeNull();
    });
  });

  // Testa quando userType é 'collaborator' (esconde create-project e create-demand)
  it('should hide create-project and create-demand tabs for collaborator user', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('collaborator');
    
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'home-key', name: 'home', params: undefined },
          { key: 'create-project-key', name: 'create-project', params: undefined },
          { key: 'create-demand-key', name: 'create-demand', params: undefined },
          { key: 'profile-key', name: 'profile', params: undefined },
        ],
        routeNames: ['home', 'create-project', 'create-demand', 'profile'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'home-key': {
          options: { href: '/home', tabBarAccessibilityLabel: 'Home', tabBarButtonTestID: 'home-tab' },
          route: { key: 'home-key', name: 'home', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'create-project-key': {
          options: { href: '/create-project', tabBarAccessibilityLabel: 'Create Project', tabBarButtonTestID: 'create-project-tab' },
          route: { key: 'create-project-key', name: 'create-project', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'create-demand-key': {
          options: { href: '/create-demand', tabBarAccessibilityLabel: 'Create Demand', tabBarButtonTestID: 'create-demand-tab' },
          route: { key: 'create-demand-key', name: 'create-demand', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'profile-key': {
          options: { href: '/profile', tabBarAccessibilityLabel: 'Profile', tabBarButtonTestID: 'profile-tab' },
          route: { key: 'profile-key', name: 'profile', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { queryByTestId, getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('home-tab')).toBeDefined();
      expect(queryByTestId('create-project-tab')).toBeNull();
      expect(queryByTestId('create-demand-tab')).toBeNull();
    });
  });

  // Testa quando userType é null (guest - esconde create-project, create-demand e favorites)
  it('should hide create tabs and favorites for guest user (null)', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'home-key', name: 'home', params: undefined },
          { key: 'favorites-key', name: 'favorites', params: undefined },
          { key: 'create-project-key', name: 'create-project', params: undefined },
          { key: 'profile-key', name: 'profile', params: undefined },
        ],
        routeNames: ['home', 'favorites', 'create-project', 'profile'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'home-key': {
          options: { href: '/home', tabBarAccessibilityLabel: 'Home', tabBarButtonTestID: 'home-tab' },
          route: { key: 'home-key', name: 'home', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'favorites-key': {
          options: { href: '/favorites', tabBarAccessibilityLabel: 'Favorites', tabBarButtonTestID: 'favorites-tab' },
          route: { key: 'favorites-key', name: 'favorites', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'create-project-key': {
          options: { href: '/create-project', tabBarAccessibilityLabel: 'Create Project', tabBarButtonTestID: 'create-project-tab' },
          route: { key: 'create-project-key', name: 'create-project', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'profile-key': {
          options: { href: '/profile', tabBarAccessibilityLabel: 'Profile', tabBarButtonTestID: 'profile-tab' },
          route: { key: 'profile-key', name: 'profile', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { queryByTestId, getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('home-tab')).toBeDefined();
      expect(queryByTestId('favorites-tab')).toBeNull();
      expect(queryByTestId('create-project-tab')).toBeNull();
    });
  });

  // Testa ícone desconhecido (fallback)
  it('should render fallback icon for unknown route', async () => {
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'unknown-key', name: 'unknown-route', params: undefined },
        ],
        routeNames: ['unknown-route'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'unknown-key': {
          options: { href: '/unknown', tabBarAccessibilityLabel: 'Unknown', tabBarButtonTestID: 'unknown-tab' },
          route: { key: 'unknown-key', name: 'unknown-route', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('unknown-tab')).toBeDefined();
    });
  });

  // Testa quando href é null (rota deve ser ocultada)
  it('should hide routes with null href', async () => {
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'home-key', name: 'home', params: undefined },
          { key: 'hidden-key', name: 'hidden', params: undefined },
        ],
        routeNames: ['home', 'hidden'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'home-key': {
          options: { href: '/home', tabBarAccessibilityLabel: 'Home', tabBarButtonTestID: 'home-tab' },
          route: { key: 'home-key', name: 'home', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'hidden-key': {
          options: { href: null, tabBarAccessibilityLabel: 'Hidden', tabBarButtonTestID: 'hidden-tab' },
          route: { key: 'hidden-key', name: 'hidden', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { queryByTestId, getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('home-tab')).toBeDefined();
      expect(queryByTestId('hidden-tab')).toBeNull();
    });
  });

  // Testa navegação quando evento não é prevenido
  it('should navigate when pressing inactive tab and event is not prevented', async () => {
    const mockProps = createMockProps(0); // home é ativa
    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      const searchTab = getByTestId('search-tab');
      fireEvent.press(searchTab);
    });

    expect(mockProps.navigation.navigate).toHaveBeenCalledWith('search', undefined);
  });

  // Testa renderização do ícone favorites
  it('should render favorites icon', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('researcher');
    
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'favorites-key', name: 'favorites', params: undefined },
        ],
        routeNames: ['favorites'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'favorites-key': {
          options: { href: '/favorites', tabBarAccessibilityLabel: 'Favorites', tabBarButtonTestID: 'favorites-tab' },
          route: { key: 'favorites-key', name: 'favorites', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('favorites-tab')).toBeDefined();
    });
  });

  // Testa renderização do ícone create-project para researcher
  it('should render create-project icon for researcher', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('researcher');
    
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'create-project-key', name: 'create-project', params: undefined },
        ],
        routeNames: ['create-project'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'create-project-key': {
          options: { href: '/create-project', tabBarAccessibilityLabel: 'Create Project', tabBarButtonTestID: 'create-project-tab' },
          route: { key: 'create-project-key', name: 'create-project', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('create-project-tab')).toBeDefined();
    });
  });

  // Testa renderização do ícone create-demand para company
  it('should render create-demand icon for company', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('company');
    
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'create-demand-key', name: 'create-demand', params: undefined },
        ],
        routeNames: ['create-demand'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'create-demand-key': {
          options: { href: '/create-demand', tabBarAccessibilityLabel: 'Create Demand', tabBarButtonTestID: 'create-demand-tab' },
          route: { key: 'create-demand-key', name: 'create-demand', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('create-demand-tab')).toBeDefined();
    });
  });

  // Testa que researcher não vê create-demand
  it('should hide create-demand tab for researcher user', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('researcher');
    
    const mockProps = {
      ...createMockProps(),
      state: {
        index: 0,
        routes: [
          { key: 'home-key', name: 'home', params: undefined },
          { key: 'create-demand-key', name: 'create-demand', params: undefined },
        ],
        routeNames: ['home', 'create-demand'],
        history: [],
        type: 'tab' as const,
        stale: false,
      },
      descriptors: {
        'home-key': {
          options: { href: '/home', tabBarAccessibilityLabel: 'Home', tabBarButtonTestID: 'home-tab' },
          route: { key: 'home-key', name: 'home', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
        'create-demand-key': {
          options: { href: '/create-demand', tabBarAccessibilityLabel: 'Create Demand', tabBarButtonTestID: 'create-demand-tab' },
          route: { key: 'create-demand-key', name: 'create-demand', params: undefined },
          navigation: {} as any,
          render: () => null,
        },
      },
    };

    const { queryByTestId, getByTestId } = render(<NavBar {...mockProps as any} />);

    await waitFor(() => {
      expect(getByTestId('home-tab')).toBeDefined();
      expect(queryByTestId('create-demand-tab')).toBeNull();
    });
  });
});
import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavBar } from '../NavBar';

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
});
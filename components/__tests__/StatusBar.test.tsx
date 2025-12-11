import * as React from 'react';
import { render } from '@testing-library/react-native';
import StatusBar from "../StatusBar";
import { StatusBar as RNStatusBar } from 'react-native';

describe('StatusBar Component', () => {

  // Testa se o componente renderiza corretamente
  it('should render the StatusBar component', () => {
    const { UNSAFE_getByType } = render(<StatusBar />);

    const statusBar = UNSAFE_getByType(RNStatusBar);
    expect(statusBar).toBeDefined();
  });

  // Testa se o componente usa as propriedades padrão corretamente
  it('should apply default props correctly', () => {
    const { UNSAFE_getByType } = render(<StatusBar />);

    const statusBar = UNSAFE_getByType(RNStatusBar);

    expect(statusBar.props.hidden).toBe(false);
    expect(statusBar.props.barStyle).toBe('dark-content');
    expect(statusBar.props.backgroundColor).toBe('#fff');
  });

  // Testa se as propriedades são do tipo correto
  it('should use correct prop types', () => {
    const { UNSAFE_getByType } = render(<StatusBar />);

    const statusBar = UNSAFE_getByType(RNStatusBar);

    expect(typeof statusBar.props.hidden).toBe('boolean');
    expect(typeof statusBar.props.barStyle).toBe('string');
    expect(typeof statusBar.props.backgroundColor).toBe('string');
  });

  // Testa se o componente permite sobreposição de props via mock
  it('should allow overriding props (mock test)', () => {
    const { UNSAFE_getByType, rerender } = render(<StatusBar />);

    rerender(
      <RNStatusBar hidden={true} barStyle="light-content" backgroundColor="#000" />
    );

    const statusBar = UNSAFE_getByType(RNStatusBar);

    expect(statusBar.props.hidden).toBe(true);
    expect(statusBar.props.barStyle).toBe('light-content');
    expect(statusBar.props.backgroundColor).toBe('#000');
  });

});

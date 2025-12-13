import React from 'react';
import { render } from '@testing-library/react-native';
import { AppText } from '../AppText';
import { Text } from 'react-native';

describe('AppText Component', () => {
  // Testa se o componente renderiza o texto filho corretamente
  it('should render children text correctly', () => {
    const textToRender = 'Hello World';
    const { getByText } = render(<AppText>{textToRender}</AppText>);
    
    // Verifica se o texto está no documento
    const textElement = getByText(textToRender);
    expect(textElement).toBeDefined();
  });

  // Testa se os estilos customizados são aplicados
  it('should apply custom styles to the text', () => {
    const customStyle = { color: 'red', fontSize: 20 };
    const { getByText } = render(
      <AppText style={customStyle}>Custom Style Test</AppText>
    );
    
    const textElement = getByText('Custom Style Test');
    
    // @ts-ignore - a propriedade style existe no elemento, mas o tipo pode ser complexo
    const appliedStyle = textElement.props.style.find(
      (s: { color?: string; fontSize?: number }) => s && s.color === 'red' && s.fontSize === 20
    );
    
    expect(appliedStyle).toBeDefined();
  });

  // Testa se outras props de Text são passadas corretamente
  it('should pass down other Text props', () => {
    const { getByTestId } = render(
      <AppText testID="my-app-text">Other Props</AppText>
    );

    const textElement = getByTestId('my-app-text');
    expect(textElement).toBeDefined();
  });
});
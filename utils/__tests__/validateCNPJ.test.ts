import { validateCNPJ } from '../validateCNPJ';
import { Alert } from 'react-native';

// mock do Alert
jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() }
}));

describe('validateCNPJ', () => {

  const validCNPJ = '45.723.174/0001-10';

  // CNPJ válido
  test('deve retornar true para um CNPJ válido', () => {
    expect(validateCNPJ(validCNPJ)).toBe(true);
  });

  // Entrada vazia
  test('deve retornar false para entrada vazia', () => {
    expect(validateCNPJ('')).toBe(false);
    expect(Alert.alert).toHaveBeenCalled();
  });

  // Menos de 14 dígitos
  test('deve retornar false para CNPJ com menos de 14 dígitos', () => {
    expect(validateCNPJ('1234')).toBe(false);
    expect(Alert.alert).toHaveBeenCalled();
  });

  // Mais de 14 dígitos depois de limpar
  test('deve retornar false para CNPJ com mais de 14 dígitos', () => {
    expect(validateCNPJ('111222333444555')).toBe(false);
    expect(Alert.alert).toHaveBeenCalled();
  });

  // Sequência repetida
  test('deve retornar false para CNPJ com todos dígitos iguais', () => {
    expect(validateCNPJ('00000000000000')).toBe(false);
    expect(Alert.alert).toHaveBeenCalled();
  });

  // Dígito verificador incorreto
  test('deve retornar false para CNPJ com dígito verificador inválido', () => {
    expect(validateCNPJ('45.723.174/0001-11')).toBe(false);
    expect(Alert.alert).toHaveBeenCalled();
  });

  // Deve limpar caracteres e validar corretamente
  test('deve validar mesmo com caracteres não numéricos', () => {
    expect(validateCNPJ('45-723.174/0001-10')).toBe(true);
  });

});

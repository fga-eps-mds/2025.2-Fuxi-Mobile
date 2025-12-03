// utils/__tests__/validateEmail.test.ts

import { validateEmail } from '../validateEmail';
import { Alert } from 'react-native';

jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() }
}));

describe('validateEmail', () => {

  // Email válido
  test('deve retornar true para email válido', () => {
    expect(validateEmail('teste@gmail.com')).toBe(true);
  });

  // Entrada vazia
  test('deve retornar false ao receber string vazia', () => {
    expect(validateEmail('')).toBe(false);
    expect(Alert.alert).toHaveBeenCalled();
  });

  // Sem arroba
  test('deve retornar false para email sem arroba', () => {
    expect(validateEmail('testegmail.com')).toBe(false);
  });

  // Sem ponto depois do arroba
  test('deve retornar false quando não houver ponto depois do arroba', () => {
    expect(validateEmail('teste@gmail')).toBe(false);
  });

  // Ponto no final
  test('deve retornar false se terminar com ponto', () => {
    expect(validateEmail('teste@gmail.')).toBe(false);
  });

  // Espaços extras
  test('deve aceitar emails com espaços ao redor', () => {
    expect(validateEmail('   teste@gmail.com   ')).toBe(true);
  });

});

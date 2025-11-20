import { formatCNPJ } from '../formatCNPJ';

describe('formatCNPJ', () => {

  // CNPJ completo (14 dígitos)
  test('deve formatar um CNPJ completo corretamente', () => {
    const input = '12345678000199';
    const expected = '12.345.678/0001-99';
    expect(formatCNPJ(input)).toBe(expected);
  });

  // Deve limpar caracteres não numéricos
  test('deve limpar e formatar corretamente um CNPJ com caracteres extras', () => {
    const input = '12.34.567-8/000.1.99a';
    const expected = '12.345.678/0001-99';
    expect(formatCNPJ(input)).toBe(expected);
  });

  // Deve limitar a entrada a 14 dígitos
  test('deve limitar a entrada a 14 dígitos ignorando o excesso', () => {
    const input = '12345678000199000';
    const expected = '12.345.678/0001-99';
    expect(formatCNPJ(input)).toBe(expected);
  });

  // TESTES PROGRESSIVOS
  test('parcial — 2 dígitos', () => {
    expect(formatCNPJ('12')).toBe('12');
  });

  test('parcial — 5 dígitos (XX.XXX)', () => {
    expect(formatCNPJ('12345')).toBe('12.345');
  });

  test('parcial — 8 dígitos (XX.XXX.XXX)', () => {
    expect(formatCNPJ('12345678')).toBe('12.345.678');
  });

  test('parcial — 12 dígitos (XX.XXX.XXX/XXXX)', () => {
    expect(formatCNPJ('123456780001')).toBe('12.345.678/0001');
  });

  // TESTES DE LIMITE
  test('entrada vazia', () => {
    expect(formatCNPJ('')).toBe('');
  });

  test('apenas caracteres não numéricos', () => {
    expect(formatCNPJ('abc-d/efg')).toBe('');
  });

});

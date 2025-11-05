// utils/formatCNPJ.ts

export function formatCNPJ(value: string): string {
  // Remove tudo que não for número
  const cleaned = value.replace(/\D/g, '').slice(0, 14);

  // Aplica a máscara gradualmente conforme o tamanho
  let formatted = cleaned;
  if (cleaned.length <= 2) {
    formatted = cleaned;
  } else if (cleaned.length <= 5) {
    formatted = cleaned.replace(/^(\d{2})(\d+)/, '$1.$2');
  } else if (cleaned.length <= 8) {
    formatted = cleaned.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
  } else if (cleaned.length <= 12) {
    formatted = cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
  } else {
    formatted = cleaned.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/,
      '$1.$2.$3/$4-$5'
    );
  }

  return formatted;
}

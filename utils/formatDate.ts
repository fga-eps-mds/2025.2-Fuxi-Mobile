export function formatDate(value: string): string {
  // Remove tudo que não for número
  const cleaned = value.replace(/\D/g, "");

  let formatted = cleaned;

  // Adiciona a barra após o dia
  if (cleaned.length > 2) {
    formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  }

  // Adiciona a segunda barra após o mês
  if (cleaned.length > 4) {
    formatted = formatted.slice(0, 5) + "/" + cleaned.slice(4, 8);
  }

  // Limita o tamanho total a 10 caracteres (DD/MM/AAAA)
  return formatted.slice(0, 10);
}
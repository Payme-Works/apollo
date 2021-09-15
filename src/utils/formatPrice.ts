export function formatPrice(value?: number): string {
  let valueToFormat = 0;

  if (value !== undefined) {
    valueToFormat = value;
  }

  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueToFormat);
}

export default function formatPrice(value?: number): string {
  let valueToFormat = 0;

  if (value !== undefined) {
    valueToFormat = value;
  }

  const formatted = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueToFormat);

  return formatted.replace('-R$ ', 'R$ -');
}

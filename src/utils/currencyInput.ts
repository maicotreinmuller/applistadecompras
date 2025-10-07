export function formatToCurrency(value: string): string {
  // Remove non-digit characters
  const numbers = value.replace(/\D/g, '');
  
  // Convert to number and divide by 100 to get decimal value
  const amount = Number(numbers) / 100;
  
  // Format as BRL
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

export function currencyToNumber(currency: string): number {
  return Number(currency.replace(/\D/g, '')) / 100;
}

export function handleCurrencyInput(value: string): string {
  if (!value) return 'R$ 0,00';
  return formatToCurrency(value);
}
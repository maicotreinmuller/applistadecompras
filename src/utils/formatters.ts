export const formatarMoeda = (valor: number | undefined | null): string => {
  if (typeof valor !== 'number') {
    return 'R$ 0,00';
  }
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};
// Taux de change fixes pour le mock (basés sur EUR)
export const FX_RATES: Record<string, number> = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.85,
  CAD: 1.47,
  CHF: 0.95,
  JPY: 163.0,
}

export type Currency = keyof typeof FX_RATES

/**
 * Convertit un montant d'une devise vers une autre
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount
  
  // Convertir d'abord en EUR, puis vers la devise cible
  const amountInEUR = amount / FX_RATES[from]
  return Math.round((amountInEUR * FX_RATES[to]) * 100) / 100
}

/**
 * Formate un montant avec sa devise
 */
export function formatPrice(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  return formatter.format(amount)
}

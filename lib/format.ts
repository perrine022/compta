// Utilitaires de formatage pour la Côte d'Ivoire

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} XOF`
}

export function formatCurrencyWithDecimals(amount: number): string {
  return `${amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XOF`
}

// TVA par défaut en Côte d'Ivoire : 18%
export const DEFAULT_VAT_RATE = 18

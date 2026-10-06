/**
 * Redondea un número a N decimales
 * @param valor - número a redondear
 * @param decimales - número de decimales (default 2)
 */
export function redondear(valor: number, decimales: number = 2): number {
  const factor = Math.pow(10, decimales)
  return Math.round(valor * factor) / factor
}

/**
 * Formatea un número como moneda
 */
export function formatearMoneda(valor: number, moneda: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

/**
 * Formatea un número con decimales específicos
 */
export function formatearNumero(valor: number, decimales: number = 2): string {
  return valor.toLocaleString('es-MX', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
}

// Catálogo cerrado de unidades. Se guardan códigos ASCII (p. ej. 'm2');
// el símbolo legible solo se usa para mostrar.

export interface Unidad {
  codigo: string
  simbolo: string
  nombre: string
}

export const UNIDADES_OBRA: Unidad[] = [
  { codigo: 'm2', simbolo: 'm²', nombre: 'metro cuadrado' },
  { codigo: 'm3', simbolo: 'm³', nombre: 'metro cúbico' },
  { codigo: 'm', simbolo: 'm', nombre: 'metro lineal' },
  { codigo: 'pza', simbolo: 'pza', nombre: 'pieza' },
  { codigo: 'lote', simbolo: 'lote', nombre: 'lote' },
]

export const UNIDADES_INSUMO: Unidad[] = [
  { codigo: 'pza', simbolo: 'pza', nombre: 'pieza' },
  { codigo: 'kg', simbolo: 'kg', nombre: 'kilogramo' },
  { codigo: 'L', simbolo: 'L', nombre: 'litro' },
  { codigo: 'm', simbolo: 'm', nombre: 'metro' },
  { codigo: 'm2', simbolo: 'm²', nombre: 'metro cuadrado' },
  { codigo: 'm3', simbolo: 'm³', nombre: 'metro cúbico' },
  { codigo: 'bolsa', simbolo: 'bolsa', nombre: 'bolsa' },
  { codigo: 'saco', simbolo: 'saco', nombre: 'saco' },
  { codigo: 'cubeta', simbolo: 'cubeta', nombre: 'cubeta' },
  { codigo: 'lata', simbolo: 'lata', nombre: 'lata' },
  { codigo: 'jornada', simbolo: 'jornada', nombre: 'jornada de trabajo' },
  { codigo: 'hora', simbolo: 'hora', nombre: 'hora' },
  { codigo: 'dia', simbolo: 'día', nombre: 'día' },
  { codigo: 'viaje', simbolo: 'viaje', nombre: 'viaje' },
  { codigo: 'lote', simbolo: 'lote', nombre: 'lote' },
]

const TODAS = [...UNIDADES_OBRA, ...UNIDADES_INSUMO]

/** Símbolo legible para un código de unidad; devuelve el código si no existe. */
export function simboloUnidad(codigo: string): string {
  return TODAS.find((u) => u.codigo === codigo)?.simbolo ?? codigo
}

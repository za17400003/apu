import { Abertura, Superficie } from './types'

/**
 * Calcula el área bruta del muro
 */
export function calcularAreaBruta(ancho_m: number, alto_m: number): number {
  if (ancho_m <= 0 || alto_m <= 0) {
    throw new Error('Ancho y alto deben ser positivos')
  }
  return ancho_m * alto_m
}

/**
 * Calcula el área total de aberturas
 */
export function calcularAreaAberturas(aberturas: Abertura[]): number {
  return aberturas.reduce((sum, abertura) => {
    if (abertura.ancho_m < 0 || abertura.alto_m < 0) {
      throw new Error('Dimensiones de abertura no pueden ser negativas')
    }
    return sum + abertura.ancho_m * abertura.alto_m
  }, 0)
}

/**
 * Calcula el área neta del muro
 * Area neta = Area bruta - Suma de aberturas
 * Lanza error si area neta <= 0
 */
export function calcularAreaNeta(
  ancho_m: number,
  alto_m: number,
  aberturas: Abertura[]
): number {
  const area_bruta = calcularAreaBruta(ancho_m, alto_m)
  const area_aberturas = calcularAreaAberturas(aberturas)
  const area_neta = area_bruta - area_aberturas

  if (area_neta <= 0) {
    throw new Error(
      `Area neta inválida: ${area_neta.toFixed(2)} m². Las aberturas no pueden ser mayores o iguales al área bruta.`
    )
  }

  return area_neta
}

/**
 * Actualiza la superficie con cálculos de área
 */
export function actualizarSuperficieAreas(superficie: Superficie): Superficie {
  const area_bruta = calcularAreaBruta(superficie.ancho_m, superficie.alto_m)
  const area_neta = calcularAreaNeta(superficie.ancho_m, superficie.alto_m, superficie.aberturas)

  return {
    ...superficie,
    area_bruta,
    area_neta,
    fecha_actualizacion: new Date().toISOString(),
  }
}

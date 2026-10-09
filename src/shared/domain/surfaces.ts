import { Abertura, Superficie } from './types'

/** Área bruta del muro. Lanza error si las medidas no son positivas. */
export function calcularAreaBruta(ancho_m: number, alto_m: number): number {
  if (ancho_m <= 0 || alto_m <= 0) {
    throw new Error('Ancho y alto deben ser mayores que cero.')
  }
  return ancho_m * alto_m
}

export function calcularAreaAberturas(aberturas: Abertura[]): number {
  return aberturas.reduce((sum, a) => {
    if (a.ancho_m < 0 || a.alto_m < 0) {
      throw new Error('Las dimensiones de una abertura no pueden ser negativas.')
    }
    return sum + a.ancho_m * a.alto_m
  }, 0)
}

/** Área neta = área bruta − aberturas. Lanza error si no queda superficie. */
export function calcularAreaNeta(ancho_m: number, alto_m: number, aberturas: Abertura[]): number {
  const area_neta = calcularAreaBruta(ancho_m, alto_m) - calcularAreaAberturas(aberturas)
  if (area_neta <= 0) {
    throw new Error('Las aberturas igualan o superan el área del muro.')
  }
  return area_neta
}

export interface ResumenSuperficie {
  area_bruta: number
  area_aberturas: number
  area_neta: number
}

/** Áreas de un muro a partir de sus entradas. Lanza error si son inválidas. */
export function resumenSuperficie(s: Superficie): ResumenSuperficie {
  return {
    area_bruta: calcularAreaBruta(s.ancho_m, s.alto_m),
    area_aberturas: calcularAreaAberturas(s.aberturas),
    area_neta: calcularAreaNeta(s.ancho_m, s.alto_m, s.aberturas),
  }
}

import { Abertura, Superficie } from './types'
import { calcularCantidadProducto } from './quantities'

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
  cantidad_bruta: number
  cantidad_envases: number
  cantidad_final: number
}

/** Todos los resultados de un muro a partir de sus entradas. Lanza error si son inválidas. */
export function resumenSuperficie(s: Superficie): ResumenSuperficie {
  const area_bruta = calcularAreaBruta(s.ancho_m, s.alto_m)
  const area_aberturas = calcularAreaAberturas(s.aberturas)
  const area_neta = calcularAreaNeta(s.ancho_m, s.alto_m, s.aberturas)
  const cantidad = calcularCantidadProducto(
    area_neta,
    s.rendimiento,
    s.presentacion_cantidad,
    1,
    s.desperdicio_pct,
    s.redondear_envases
  )
  return {
    area_bruta,
    area_aberturas,
    area_neta,
    cantidad_bruta: cantidad.cantidad_bruta,
    cantidad_envases: cantidad.cantidad_envases,
    cantidad_final: cantidad.cantidad_final,
  }
}

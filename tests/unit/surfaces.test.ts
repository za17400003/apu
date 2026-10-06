import { describe, it, expect } from 'vitest'
import { calcularAreaBruta, calcularAreaAberturas, calcularAreaNeta } from '@/shared/domain/surfaces'

describe('Superficies - Cálculos de área', () => {
  // T4: Área neta con aberturas
  it('T4: Calcula área neta correctamente', () => {
    const aberturas = [
      { id: '1', ancho_m: 1, alto_m: 2.5 },
      { id: '2', ancho_m: 2, alto_m: 1 },
    ]
    const area_neta = calcularAreaNeta(10, 3, aberturas)
    // 30 - (2.5 + 2) = 25.5
    expect(area_neta).toBe(25.5)
  })

  // Ejemplo 2 del doc: Muro grande con múltiples aberturas
  it('Ejemplo 2: Muro 5×3 con 2 ventanas', () => {
    const aberturas = [
      { id: 'v1', ancho_m: 1.5, alto_m: 1.2 },
      { id: 'v2', ancho_m: 1.5, alto_m: 1.2 },
    ]
    const area_bruta = calcularAreaBruta(5, 3)
    const area_aberturas = calcularAreaAberturas(aberturas)
    const area_neta = calcularAreaNeta(5, 3, aberturas)

    expect(area_bruta).toBe(15)
    expect(area_aberturas).toBeCloseTo(3.6, 2)
    expect(area_neta).toBeCloseTo(11.4, 2)
  })

  it('Calcula área bruta correctamente', () => {
    expect(calcularAreaBruta(5, 3)).toBe(15)
  })

  it('Lanza error si área bruta es negativa', () => {
    expect(() => calcularAreaBruta(-5, 3)).toThrow()
  })

  it('Calcula área de aberturas', () => {
    const aberturas = [
      { id: '1', ancho_m: 1, alto_m: 2 },
      { id: '2', ancho_m: 1.5, alto_m: 1 },
    ]
    expect(calcularAreaAberturas(aberturas)).toBe(3.5)
  })

  it('Lanza error si área neta es negativa o cero', () => {
    const aberturas = [
      { id: '1', ancho_m: 10, alto_m: 3 }, // = 30, mayor que 15
    ]
    expect(() => calcularAreaNeta(5, 3, aberturas)).toThrow()
  })

  it('Calcula área neta sin aberturas', () => {
    expect(calcularAreaNeta(5, 3, [])).toBe(15)
  })
})

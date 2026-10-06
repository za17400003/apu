import { describe, it, expect } from 'vitest'
import {
  calcularCantidadBruta,
  calcularCantidadEnvases,
  redondearEnvases,
  calcularCantidadProducto,
} from '@/shared/domain/quantities'

describe('Cantidades - Cálculos de producto', () => {
  // T6: Cantidad de producto con redondeo
  it('T6: Calcula cantidad con redondeo', () => {
    // Ejemplo 3 del doc
    const resultado = calcularCantidadProducto(
      100, // área m²
      0.15, // rendimiento L/m²
      4, // presentación: 1 lata = 4L
      1, // capas
      10, // desperdicio 10%
      true // redondear
    )

    // Cantidad bruta = 100 × 0.15 × 1.10 = 16.5 L
    expect(resultado.cantidad_bruta).toBeCloseTo(16.5, 1)
    // Cantidad envases = 16.5 / 4 = 4.125
    expect(resultado.cantidad_envases).toBeCloseTo(4.125, 2)
    // Redondeado = 5
    expect(resultado.cantidad_final).toBe(5)
  })

  it('Calcula cantidad sin redondeo', () => {
    const resultado = calcularCantidadProducto(
      100,
      0.15,
      4,
      1,
      10,
      false // sin redondeo
    )

    // Retorna fraccionario
    expect(resultado.cantidad_final).toBeCloseTo(4.125, 2)
  })

  it('Calcula cantidad bruta correctamente', () => {
    // 9.3 m² × 0.15 L/m² × 1.10 (10% desperdicio) = 1.5345 L
    expect(calcularCantidadBruta(9.3, 0.15, 1, 10)).toBeCloseTo(1.5345, 3)
  })

  it('Redondea hacia arriba correctamente', () => {
    expect(redondearEnvases(2.1)).toBe(3)
    expect(redondearEnvases(2.9)).toBe(3)
    expect(redondearEnvases(2.0)).toBe(2)
    expect(redondearEnvases(2.01)).toBe(3)
  })

  it('Calcula cantidad en envases', () => {
    // 16.5 L / 4 L por lata = 4.125 latas
    expect(calcularCantidadEnvases(16.5, 4)).toBeCloseTo(4.125, 2)
  })

  it('Lanza error si presentación es cero', () => {
    expect(() => calcularCantidadEnvases(10, 0)).toThrow()
  })

  it('Calcula cantidad con múltiples capas', () => {
    // 10 m² × 0.2 L/m² × 2 capas × 1.15 (15% desperdicio) = 4.6 L
    expect(calcularCantidadBruta(10, 0.2, 2, 15)).toBeCloseTo(4.6, 1)
  })
})

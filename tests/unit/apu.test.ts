import { describe, it, expect } from 'vitest'
import { calcularCostoInsumo, calcularIndirectos, calcularUtilidad, calcularPrecioUnitario } from '@/shared/domain/apu'
import { Concepto, Insumo } from '@/shared/domain/types'

const insumo = (o: Partial<Insumo>): Insumo => ({
  id: 'x',
  descripcion: '',
  unidad: 'pza',
  cantidad: 1,
  costo_unitario: 0,
  desperdicio_pct: 0,
  ...o,
})

const concepto = (o: Partial<Concepto>): Concepto => ({
  id: 'c',
  nombre: 'Concepto',
  unidad_obra: 'm2',
  materiales: [],
  mano_obra: [],
  equipo: [],
  tasa_indirectos_pct: 0,
  base_indirectos: 'directo',
  tasa_utilidad_pct: 0,
  base_utilidad: 'directo+indirectos',
  ...o,
})

describe('APU - costo de insumos', () => {
  it('sin desperdicio: cantidad × costo', () => {
    expect(calcularCostoInsumo(insumo({ cantidad: 2, costo_unitario: 10 }))).toBe(20)
  })

  it('con desperdicio 20 %: 10 × 50 × 1.20 = 600', () => {
    expect(calcularCostoInsumo(insumo({ cantidad: 10, costo_unitario: 50, desperdicio_pct: 20 }))).toBeCloseTo(600, 10)
  })
})

describe('APU - indirectos y utilidad', () => {
  it('indirectos sobre costo directo', () => {
    expect(calcularIndirectos(1000, 500, 15, 'directo')).toBe(150)
  })

  it('indirectos solo sobre materiales', () => {
    expect(calcularIndirectos(1000, 500, 10, 'materiales')).toBe(50)
  })

  it('utilidad sobre directo + indirectos: (1000 + 150) × 25 % = 287.5', () => {
    expect(calcularUtilidad(1000, 150, 25, 'directo+indirectos')).toBeCloseTo(287.5, 10)
  })
})

describe('APU - precio unitario completo', () => {
  it('ejemplo 1 de docs/14: pintura muro → 316.25', () => {
    const c = concepto({
      materiales: [
        insumo({ descripcion: 'Pintura látex', unidad: 'L', cantidad: 0.15, costo_unitario: 400, desperdicio_pct: 10 }),
        insumo({ descripcion: 'Rodillo', cantidad: 0.05, costo_unitario: 80 }),
      ],
      mano_obra: [insumo({ unidad: 'jornada', cantidad: 0.25, costo_unitario: 600 })],
      tasa_indirectos_pct: 15,
      base_indirectos: 'directo',
      tasa_utilidad_pct: 25,
      base_utilidad: 'directo+indirectos',
    })
    const r = calcularPrecioUnitario(c)
    expect(r.materiales).toBeCloseTo(70, 10)
    expect(r.mano_obra).toBeCloseTo(150, 10)
    expect(r.costo_directo).toBeCloseTo(220, 10)
    expect(r.indirectos).toBeCloseTo(33, 10)
    expect(r.utilidad).toBeCloseTo(63.25, 10)
    expect(r.precio_unitario).toBeCloseTo(316.25, 10)
  })

  it('sin tasas el precio es el costo directo', () => {
    const c = concepto({
      materiales: [insumo({ cantidad: 2, costo_unitario: 10 })],
      mano_obra: [insumo({ unidad: 'jornada', cantidad: 1, costo_unitario: 100 })],
    })
    expect(calcularPrecioUnitario(c).precio_unitario).toBe(120)
  })
})

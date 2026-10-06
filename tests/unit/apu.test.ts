import { describe, it, expect } from 'vitest'
import {
  calcularCostoInsumo,
  calcularCostoDirecto,
  calcularIndirectos,
  calcularUtilidad,
  calcularPrecioUnitario,
} from '@/shared/domain/apu'
import { Insumo, Concepto } from '@/shared/domain/types'

describe('APU - Cálculos', () => {
  // T1: Cálculo básico sin porcentajes
  it('T1: Calcula costo insumo sin desperdicio', () => {
    const insumo: Insumo = {
      id: '1',
      descripcion: 'Material',
      unidad: 'unidad',
      cantidad: 2,
      costo_unitario: 10,
      desperdicio_pct: 0,
    }
    expect(calcularCostoInsumo(insumo)).toBe(20)
  })

  // T2: Cálculo con desperdicio
  it('T2: Calcula costo insumo con desperdicio 20%', () => {
    const insumo: Insumo = {
      id: '1',
      descripcion: 'Pintura',
      unidad: 'L',
      cantidad: 10,
      costo_unitario: 50,
      desperdicio_pct: 20,
    }
    // 10 × 50 × 1.20 = 600
    expect(calcularCostoInsumo(insumo)).toBe(600)
  })

  // T3: Cálculo con múltiples porcentajes (Ejemplo 1 del doc)
  it('T3: Pintura muro - Ejemplo 1 completo', () => {
    const concepto: Concepto = {
      id: '1',
      nombre: 'Pintura muro interior',
      unidad_obra: 'm²',
      cantidad_base: 1,
      materiales: [
        {
          id: 'm1',
          descripcion: 'Pintura látex',
          unidad: 'L',
          cantidad: 0.15,
          costo_unitario: 400,
          desperdicio_pct: 10,
        },
        {
          id: 'm2',
          descripcion: 'Rodillo',
          unidad: 'pieza',
          cantidad: 0.05,
          costo_unitario: 80,
          desperdicio_pct: 0,
        },
      ],
      mano_obra: [
        {
          id: 'mo1',
          descripcion: 'Pintor',
          unidad: 'jornada',
          cantidad: 0.25,
          costo_unitario: 600,
          desperdicio_pct: 0,
        },
      ],
      equipo: [],
      costo_directo: 0,
      tasa_indirectos_pct: 15,
      base_indirectos: 'directo',
      tasa_utilidad_pct: 25,
      base_utilidad: 'directo+indirectos',
      precio_unitario: 0,
      fecha_actualizacion: new Date().toISOString(),
    }

    const resultado = calcularPrecioUnitario(concepto)

    // Materiales: 66 + 4 = 70
    expect(resultado.costo_directo).toBeCloseTo(220, 1)
    // Indirectos: 220 × 0.15 = 33
    expect(resultado.indirectos).toBeCloseTo(33, 1)
    // Utilidad: (220 + 33) × 0.25 = 63.25
    expect(resultado.utilidad).toBeCloseTo(63.25, 1)
    // Precio: 220 + 33 + 63.25 = 316.25
    expect(resultado.precio_unitario).toBeCloseTo(316.25, 1)
  })

  // T4: Cálculo de indirectos
  it('T4: Indirectos sobre costo directo', () => {
    const indirectos = calcularIndirectos(1000, 500, 15, 'directo')
    // 1000 × 0.15 = 150
    expect(indirectos).toBe(150)
  })

  // T5: Cálculo de indirectos solo sobre materiales
  it('T5: Indirectos solo sobre materiales', () => {
    const indirectos = calcularIndirectos(1000, 500, 10, 'materiales')
    // 500 × 0.10 = 50
    expect(indirectos).toBe(50)
  })

  // T6: Cálculo de utilidad con base directo+indirectos
  it('T6: Utilidad sobre directo + indirectos', () => {
    const utilidad = calcularUtilidad(1000, 150, 25, 'directo+indirectos')
    // (1000 + 150) × 0.25 = 287.5
    expect(utilidad).toBeCloseTo(287.5, 1)
  })

  // Sin porcentajes
  it('Calcula precio unitario sin porcentajes', () => {
    const concepto: Concepto = {
      id: '1',
      nombre: 'Concepto simple',
      unidad_obra: 'm²',
      cantidad_base: 1,
      materiales: [
        {
          id: 'm1',
          descripcion: 'Material',
          unidad: 'kg',
          cantidad: 2,
          costo_unitario: 10,
          desperdicio_pct: 0,
        },
      ],
      mano_obra: [
        {
          id: 'mo1',
          descripcion: 'Mano de obra',
          unidad: 'jornada',
          cantidad: 1,
          costo_unitario: 100,
          desperdicio_pct: 0,
        },
      ],
      equipo: [],
      costo_directo: 0,
      tasa_indirectos_pct: 0,
      base_indirectos: 'directo',
      tasa_utilidad_pct: 0,
      base_utilidad: 'directo+indirectos',
      precio_unitario: 0,
      fecha_actualizacion: new Date().toISOString(),
    }

    const resultado = calcularPrecioUnitario(concepto)
    // 20 + 100 = 120
    expect(resultado.precio_unitario).toBe(120)
  })
})

import { describe, it, expect } from 'vitest'
import { cotizar } from '@/shared/domain/cotizacion'
import { nuevoConcepto, nuevoInsumo, nuevoMuro, nuevoProyecto, nuevaPartida, nuevaAbertura } from '@/shared/domain/factories'
import { Concepto, Proyecto } from '@/shared/domain/types'

/** Concepto cuyo precio unitario es exactamente 'precio' (un solo renglón, sin tasas). */
function conceptoConPrecio(precio: number): Concepto {
  const c = nuevoConcepto('Concepto', 'm2')
  c.materiales.push({ ...nuevoInsumo('pza'), cantidad: 1, costo_unitario: precio })
  return c
}

function proyectoBase(): Proyecto {
  return nuevoProyecto('Casa García')
}

describe('cotización', () => {
  it('partida manual: importe = precio unitario × cantidad', () => {
    const c = conceptoConPrecio(150)
    const p = { ...proyectoBase(), conceptos: [c], partidas: [{ ...nuevaPartida(c.id), cantidad: 2 }] }

    const r = cotizar(p)
    expect(r.lineas).toHaveLength(1)
    expect(r.lineas[0].precio_unitario).toBe(150)
    expect(r.lineas[0].importe).toBe(300)
    expect(r.subtotal).toBe(300)
    expect(r.total).toBe(300)
  })

  it('partida con muro: la cantidad es el área neta (5×3 − 1×2.1 = 12.90 m²)', () => {
    const c = conceptoConPrecio(10)
    const muro = { ...nuevoMuro('Sala norte'), aberturas: [nuevaAbertura()] }
    const p = {
      ...proyectoBase(),
      conceptos: [c],
      superficies: [muro],
      partidas: [{ ...nuevaPartida(c.id), muro_id: muro.id, cantidad: 999 }],
    }

    const r = cotizar(p)
    expect(r.lineas[0].cantidad).toBeCloseTo(12.9, 10)
    expect(r.lineas[0].importe).toBeCloseTo(129, 10)
    expect(r.lineas[0].origen).toBe('Sala norte: 12.90 m² netos')
  })

  it('muro con medidas inválidas no inventa importe: marca error', () => {
    const c = conceptoConPrecio(10)
    const muro = { ...nuevoMuro('Malo'), ancho_m: 0 }
    const p = { ...proyectoBase(), conceptos: [c], superficies: [muro], partidas: [{ ...nuevaPartida(c.id), muro_id: muro.id }] }

    const r = cotizar(p)
    expect(r.lineas[0].error).toBeTruthy()
    expect(r.lineas[0].importe).toBe(0)
  })

  it('partidas que apuntan a un concepto borrado se cuentan y no se cotizan', () => {
    const c = conceptoConPrecio(10)
    const p = { ...proyectoBase(), conceptos: [], partidas: [nuevaPartida(c.id)] }

    const r = cotizar(p)
    expect(r.lineas).toHaveLength(0)
    expect(r.partidas_huerfanas).toBe(1)
  })

  it('IVA y anticipo se calculan sobre el subtotal y el total', () => {
    const c = conceptoConPrecio(100)
    const p = {
      ...proyectoBase(),
      iva_pct: 16,
      anticipo_pct: 50,
      conceptos: [c],
      partidas: [{ ...nuevaPartida(c.id), cantidad: 10 }],
    }

    const r = cotizar(p)
    expect(r.subtotal).toBe(1000)
    expect(r.iva).toBeCloseTo(160, 10)
    expect(r.total).toBeCloseTo(1160, 10)
    expect(r.anticipo).toBeCloseTo(580, 10)
  })
})

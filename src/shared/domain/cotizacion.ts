// Cotización: combina partidas (concepto APU × cantidad) en un presupuesto.
// Solo calcula; no guarda nada.

import { Concepto, Proyecto } from './types'
import { calcularPrecioUnitario } from './apu'
import { resumenSuperficie } from './surfaces'

export interface LineaCotizacion {
  numero: number
  partida_id: string
  concepto: Concepto
  cantidad: number
  /** Texto de procedencia de la cantidad, p. ej. "Sala norte: 12.90 m² netos". Vacío si es manual. */
  origen: string
  precio_unitario: number
  importe: number
  /** Motivo por el que la cantidad no se pudo calcular (muro sin medidas válidas). */
  error?: string
}

export interface Cotizacion {
  lineas: LineaCotizacion[]
  /** Partidas que apuntan a un concepto borrado. Se excluyen y se avisan. */
  partidas_huerfanas: number
  subtotal: number
  iva: number
  total: number
  anticipo: number
}

export function cotizar(p: Proyecto): Cotizacion {
  const lineas: LineaCotizacion[] = []
  let huerfanas = 0

  for (const partida of p.partidas) {
    const concepto = p.conceptos.find((c) => c.id === partida.concepto_id)
    if (!concepto) {
      huerfanas++
      continue
    }

    let cantidad = partida.cantidad
    let origen = ''
    let error: string | undefined

    if (partida.muro_id) {
      const muro = p.superficies.find((s) => s.id === partida.muro_id)
      if (!muro) {
        error = 'El muro vinculado ya no existe.'
        cantidad = 0
      } else {
        try {
          const area = resumenSuperficie(muro).area_neta
          cantidad = area
          origen = `${muro.nombre || 'Muro sin nombre'}: ${area.toFixed(2)} m² netos`
        } catch (e) {
          error = e instanceof Error ? e.message : 'Medidas del muro no válidas.'
          cantidad = 0
        }
      }
    }

    const precio = calcularPrecioUnitario(concepto).precio_unitario
    lineas.push({
      numero: lineas.length + 1,
      partida_id: partida.id,
      concepto,
      cantidad,
      origen,
      precio_unitario: precio,
      importe: precio * cantidad,
      error,
    })
  }

  const subtotal = lineas.reduce((s, l) => s + l.importe, 0)
  const iva = (subtotal * p.iva_pct) / 100
  const total = subtotal + iva
  const anticipo = (total * p.anticipo_pct) / 100

  return { lineas, partidas_huerfanas: huerfanas, subtotal, iva, total, anticipo }
}

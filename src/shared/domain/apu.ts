import { Insumo, Concepto } from './types'

/**
 * Costo de un insumo con desperdicio.
 * Costo = Cantidad × Costo unitario × (1 + Desperdicio%)
 */
export function calcularCostoInsumo(insumo: Insumo): number {
  return insumo.cantidad * insumo.costo_unitario * (1 + insumo.desperdicio_pct / 100)
}

/** Suma de importes sin redondeo intermedio. */
export function sumarInsumos(insumos: Insumo[]): number {
  return insumos.reduce((sum, insumo) => sum + calcularCostoInsumo(insumo), 0)
}

export function calcularIndirectos(
  costo_directo: number,
  costo_materiales: number,
  tasa_pct: number,
  base: Concepto['base_indirectos']
): number {
  const base_monto = base === 'directo' ? costo_directo : costo_materiales
  return (base_monto * tasa_pct) / 100
}

export function calcularUtilidad(
  costo_directo: number,
  indirectos: number,
  tasa_pct: number,
  base: Concepto['base_utilidad']
): number {
  const base_monto = base === 'directo+indirectos' ? costo_directo + indirectos : costo_directo
  return (base_monto * tasa_pct) / 100
}

export interface DesgloseApu {
  materiales: number
  mano_obra: number
  equipo: number
  costo_directo: number
  indirectos: number
  utilidad: number
  precio_unitario: number
}

/** Desglose completo del precio unitario de un concepto. */
export function calcularPrecioUnitario(concepto: Concepto): DesgloseApu {
  const materiales = sumarInsumos(concepto.materiales)
  const mano_obra = sumarInsumos(concepto.mano_obra)
  const equipo = sumarInsumos(concepto.equipo)
  const costo_directo = materiales + mano_obra + equipo

  const indirectos = calcularIndirectos(
    costo_directo,
    materiales,
    concepto.tasa_indirectos_pct,
    concepto.base_indirectos
  )
  const utilidad = calcularUtilidad(
    costo_directo,
    indirectos,
    concepto.tasa_utilidad_pct,
    concepto.base_utilidad
  )

  return {
    materiales,
    mano_obra,
    equipo,
    costo_directo,
    indirectos,
    utilidad,
    precio_unitario: costo_directo + indirectos + utilidad,
  }
}

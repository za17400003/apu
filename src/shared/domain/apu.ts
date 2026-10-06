import { Insumo, Concepto } from './types'

/**
 * Calcula el costo de un insumo incluyendo desperdicio
 * Fórmula: Costo = Cantidad × Costo unitario × (1 + Desperdicio%)
 */
export function calcularCostoInsumo(insumo: Insumo): number {
  const factor_desperdicio = 1 + insumo.desperdicio_pct / 100
  return insumo.cantidad * insumo.costo_unitario * factor_desperdicio
}

/**
 * Suma costos de una lista de insumos sin redondeo intermedio
 */
export function sumarInsumos(insumos: Insumo[]): number {
  return insumos.reduce((sum, insumo) => sum + calcularCostoInsumo(insumo), 0)
}

/**
 * Calcula el costo directo total (materiales + mano obra + equipo)
 */
export function calcularCostoDirecto(
  materiales: Insumo[],
  mano_obra: Insumo[],
  equipo: Insumo[]
): number {
  return sumarInsumos(materiales) + sumarInsumos(mano_obra) + sumarInsumos(equipo)
}

/**
 * Calcula los indirectos según base seleccionada
 * Base: 'directo' o 'materiales'
 */
export function calcularIndirectos(
  costo_directo: number,
  costo_materiales: number,
  tasa_pct: number,
  base: 'directo' | 'materiales'
): number {
  const base_amount = base === 'directo' ? costo_directo : costo_materiales
  return (base_amount * tasa_pct) / 100
}

/**
 * Calcula la utilidad según base seleccionada
 * Base: 'directo+indirectos' o 'directo'
 */
export function calcularUtilidad(
  costo_directo: number,
  indirectos: number,
  tasa_pct: number,
  base: 'directo+indirectos' | 'directo'
): number {
  const base_amount = base === 'directo+indirectos' ? costo_directo + indirectos : costo_directo
  return (base_amount * tasa_pct) / 100
}

/**
 * Calcula el precio unitario completo sin redondeo intermedio
 * Retorna objeto con desglose completo
 */
export function calcularPrecioUnitario(concepto: Concepto): {
  costo_directo: number
  indirectos: number
  utilidad: number
  precio_unitario: number
} {
  const costo_materiales = sumarInsumos(concepto.materiales)
  const costo_directo = calcularCostoDirecto(
    concepto.materiales,
    concepto.mano_obra,
    concepto.equipo
  )

  const indirectos = calcularIndirectos(
    costo_directo,
    costo_materiales,
    concepto.tasa_indirectos_pct,
    concepto.base_indirectos
  )

  const utilidad = calcularUtilidad(
    costo_directo,
    indirectos,
    concepto.tasa_utilidad_pct,
    concepto.base_utilidad
  )

  const precio_unitario = costo_directo + indirectos + utilidad

  return {
    costo_directo,
    indirectos,
    utilidad,
    precio_unitario,
  }
}

/**
 * Actualiza el concepto con los cálculos finales
 */
export function actualizarConceptoConCalculos(concepto: Concepto): Concepto {
  const calculos = calcularPrecioUnitario(concepto)
  return {
    ...concepto,
    costo_directo: calculos.costo_directo,
    precio_unitario: calculos.precio_unitario,
    fecha_actualizacion: new Date().toISOString(),
  }
}

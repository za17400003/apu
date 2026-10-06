/**
 * Calcula la cantidad bruta de producto necesario
 * Fórmula: Cantidad = Area × Rendimiento × Capas × (1 + Desperdicio%)
 */
export function calcularCantidadBruta(
  area_neta_m2: number,
  rendimiento_por_m2: number,
  capas: number = 1,
  desperdicio_pct: number = 0
): number {
  const factor_desperdicio = 1 + desperdicio_pct / 100
  return area_neta_m2 * rendimiento_por_m2 * capas * factor_desperdicio
}

/**
 * Calcula la cantidad en envases (litros, kg, etc.)
 */
export function calcularCantidadEnvases(
  cantidad_bruta: number,
  presentacion_cantidad: number
): number {
  if (presentacion_cantidad <= 0) {
    throw new Error('La presentación debe ser positiva')
  }
  return cantidad_bruta / presentacion_cantidad
}

/**
 * Redondea la cantidad de envases hacia arriba
 */
export function redondearEnvases(cantidad_envases: number): number {
  return Math.ceil(cantidad_envases)
}

/**
 * Calcula la cantidad total de envases necesarios
 * Si redondear es true, redondea hacia arriba; si no, retorna fraccionario
 */
export function calcularCantidadProducto(
  area_neta_m2: number,
  rendimiento_por_m2: number,
  presentacion_cantidad: number,
  capas: number = 1,
  desperdicio_pct: number = 0,
  redondear: boolean = true
): {
  cantidad_bruta: number
  cantidad_envases: number
  cantidad_final: number
} {
  const cantidad_bruta = calcularCantidadBruta(area_neta_m2, rendimiento_por_m2, capas, desperdicio_pct)
  const cantidad_envases = calcularCantidadEnvases(cantidad_bruta, presentacion_cantidad)
  const cantidad_final = redondear ? redondearEnvases(cantidad_envases) : cantidad_envases

  return {
    cantidad_bruta,
    cantidad_envases,
    cantidad_final,
  }
}

/**
 * Calcula el costo del producto
 */
export function calcularCostoProducto(
  cantidad_final: number,
  precio_por_envase: number
): number {
  return cantidad_final * precio_por_envase
}

// Modelo de dominio. Solo se guardan entradas del usuario; los resultados
// (costo directo, precio unitario, áreas, importes) se calculan al mostrar.

export type BaseIndirectos = 'directo' | 'materiales'
export type BaseUtilidad = 'directo+indirectos' | 'directo'

export interface Insumo {
  id: string
  descripcion: string
  unidad: string // código de UNIDADES_INSUMO
  cantidad: number // por unidad de obra
  costo_unitario: number
  desperdicio_pct: number // 0-100
  fuente?: string // proveedor o referencia del precio
  fecha_precio?: string // AAAA-MM-DD; sin fecha el precio no tiene vigencia conocida
}

export interface Concepto {
  id: string
  nombre: string
  unidad_obra: string // código de UNIDADES_OBRA, p. ej. 'm2'
  materiales: Insumo[]
  mano_obra: Insumo[]
  equipo: Insumo[]
  tasa_indirectos_pct: number
  base_indirectos: BaseIndirectos
  tasa_utilidad_pct: number
  base_utilidad: BaseUtilidad
}

export interface Abertura {
  id: string
  ancho_m: number
  alto_m: number
}

export interface Superficie {
  id: string
  nombre: string
  ancho_m: number
  alto_m: number
  aberturas: Abertura[]
  acabado: string
  rendimiento: number // unidad_compra por m²
  unidad_compra: string // código de UNIDADES_COMPRA
  presentacion_cantidad: number // contenido de un envase, en unidad_compra
  desperdicio_pct: number
  redondear_envases: boolean
}

/** Renglón de la cotización: un concepto del APU y su cantidad de obra. */
export interface Partida {
  id: string
  concepto_id: string
  /** Si existe, la cantidad es el área neta de ese muro (no se captura a mano). */
  muro_id?: string
  /** Cantidad manual; se ignora cuando hay muro_id. */
  cantidad: number
}

export interface Proyecto {
  id: string
  nombre: string
  fecha_creacion: string
  cliente?: string
  obra?: string // dirección o ubicación de la obra
  folio?: string
  moneda: string // código ISO: MXN, USD, EUR, COP
  notas?: string
  /** IVA en % sobre el subtotal. 0 = no se agrega (se indica en la cotización). */
  iva_pct: number
  /** Anticipo en % del total. 0 = sin anticipo. */
  anticipo_pct: number
  vigencia_dias: number
  conceptos: Concepto[]
  superficies: Superficie[]
  partidas: Partida[]
  /** Archivado sale de la lista principal sin borrarse. Ausente o false = activo. */
  archivado?: boolean
}

/** Datos del contratista. Son los mismos para todos los proyectos. */
export interface Perfil {
  key: 'perfil'
  nombre_comercial: string
  responsable: string
  telefono: string
  direccion: string
}

// Tipos de dominio - modelo compartido sin dependencias externas

export interface Insumo {
  id: string
  descripcion: string
  unidad: string // L, kg, jornada, pieza, etc.
  cantidad: number // por unidad de obra
  costo_unitario: number
  desperdicio_pct: number // 0-100
  fuente?: string
  fecha_precio?: string
}

export interface Concepto {
  id: string
  nombre: string
  unidad_obra: string // m², m, pieza
  cantidad_base: number
  materiales: Insumo[]
  mano_obra: Insumo[]
  equipo: Insumo[]
  costo_directo: number
  tasa_indirectos_pct: number
  base_indirectos: 'directo' | 'materiales'
  tasa_utilidad_pct: number
  base_utilidad: 'directo+indirectos' | 'directo'
  precio_unitario: number
  fecha_actualizacion: string
}

export interface Abertura {
  id: string
  ancho_m: number
  alto_m: number
}

export interface Superficie {
  id: string
  project_id: string
  nombre: string
  ancho_m: number
  alto_m: number
  aberturas: Abertura[]
  area_bruta: number
  area_neta: number
  acabado: string
  producto_id?: string
  rendimiento: number // L/m², kg/m², etc.
  desperdicio_pct: number
  presentacion: string // 1L, 4L, 20kg, etc.
  cantidad_redondeada: boolean
  cantidad_total: number
  fecha_actualizacion: string
}

export interface Proyecto {
  id: string
  nombre: string
  fecha_creacion: string
  ubicacion?: string
  moneda: string // MXN, USD, etc.
  notas?: string
  conceptos: Concepto[]
  superficies: Superficie[]
}

export interface Preferencias {
  key: 'singleton'
  moneda: string
  indirectos_default_pct: number
  utilidad_default_pct: number
  idioma: string
}

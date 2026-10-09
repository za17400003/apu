// Constructores de entidades nuevas con valores iniciales neutros.
// Las tasas arrancan en 0: el proyecto no asume porcentajes estándar.

import { Abertura, Concepto, Insumo, Partida, Proyecto, Superficie } from './types'
import { nuevoId } from './ids'
import { hoyISO } from './fechas'

const id = nuevoId

export function nuevoProyecto(nombre = ''): Proyecto {
  return {
    id: id(),
    nombre,
    fecha_creacion: new Date().toISOString(),
    moneda: 'MXN',
    iva_pct: 0,
    anticipo_pct: 0,
    vigencia_dias: 15,
    conceptos: [],
    superficies: [],
    partidas: [],
  }
}

export function nuevoConcepto(nombre: string, unidad_obra: string): Concepto {
  return {
    id: id(),
    nombre,
    unidad_obra,
    materiales: [],
    mano_obra: [],
    equipo: [],
    tasa_indirectos_pct: 0,
    base_indirectos: 'directo',
    tasa_utilidad_pct: 0,
    base_utilidad: 'directo+indirectos',
  }
}

export function nuevoInsumo(unidad: string): Insumo {
  // El precio que se captura hoy tiene como fecha de referencia hoy; se puede cambiar a días anteriores.
  return {
    id: id(),
    descripcion: '',
    unidad,
    cantidad: 1,
    costo_unitario: 0,
    desperdicio_pct: 0,
    fecha_precio: hoyISO(),
  }
}

export function nuevoMuro(nombre: string): Superficie {
  return { id: id(), nombre, ancho_m: 5, alto_m: 3, aberturas: [], acabado: '' }
}

export function nuevaAbertura(): Abertura {
  return { id: id(), ancho_m: 1, alto_m: 2.1 }
}

export function nuevaPartida(concepto_id: string): Partida {
  return { id: id(), concepto_id, cantidad: 1 }
}

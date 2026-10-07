// Copia un proyecto completo con identificadores nuevos. La copia no comparte
// conceptos, muros ni partidas con el original: editar una no toca la otra.

import { Proyecto } from './types'
import { nuevoId } from './ids'

export function duplicarProyecto(origen: Proyecto, nombre: string): Proyecto {
  const { archivado: _archivado, ...base } = origen

  const idConcepto = new Map(origen.conceptos.map((c) => [c.id, nuevoId()]))
  const idMuro = new Map(origen.superficies.map((s) => [s.id, nuevoId()]))
  const copiarInsumos = (lista: Proyecto['conceptos'][number]['materiales']) => lista.map((i) => ({ ...i, id: nuevoId() }))

  return {
    ...base,
    id: nuevoId(),
    nombre,
    fecha_creacion: new Date().toISOString(),
    conceptos: origen.conceptos.map((c) => ({
      ...c,
      id: idConcepto.get(c.id) ?? nuevoId(),
      materiales: copiarInsumos(c.materiales),
      mano_obra: copiarInsumos(c.mano_obra),
      equipo: copiarInsumos(c.equipo),
    })),
    superficies: origen.superficies.map((s) => ({
      ...s,
      id: idMuro.get(s.id) ?? nuevoId(),
      aberturas: s.aberturas.map((a) => ({ ...a, id: nuevoId() })),
    })),
    partidas: origen.partidas.map((pt) => ({
      ...pt,
      id: nuevoId(),
      concepto_id: idConcepto.get(pt.concepto_id) ?? pt.concepto_id,
      muro_id: pt.muro_id === undefined ? undefined : (idMuro.get(pt.muro_id) ?? ''),
    })),
  }
}
